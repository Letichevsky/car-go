#!/usr/bin/env node
/**
 * Оптимизация медиа Car-Go.
 *
 * Фото:  assets/raw/**\/*.jpg → assets/optimized/**\/<имя>-<ширина>.{avif,webp}
 * Видео: assets/raw/**\/*.mp4 → assets/optimized/**\/<имя>.mp4 (H.264, faststart) + постер
 *
 * Структура папок из raw повторяется в optimized — разложите сырьё по категориям
 * (team/, process/, packing/, vans/, furniture/, office/) и запустите ещё раз.
 *
 *   node scripts/optimize-media.mjs           # только фото
 *   node scripts/optimize-media.mjs --video   # фото и видео (нужен ffmpeg)
 *   node scripts/optimize-media.mjs --force   # переделать уже готовое
 *
 * Результат описан в assets/optimized/manifest.json: размеры, соотношение сторон
 * и LQIP — крошечная размытая заглушка в base64, чтобы не прыгала вёрстка.
 */

import { readdir, mkdir, stat, writeFile } from "node:fs/promises";
import { existsSync } from "node:fs";
import { join, relative, dirname, extname, basename } from "node:path";
import { execFile } from "node:child_process";
import { promisify } from "node:util";
import sharp from "sharp";

const run = promisify(execFile);

const RAW = "assets/raw";
const OUT = "assets/optimized";

/** Ширины под брейкпоинты. Апскейла нет: размер больше исходника пропускается. */
const WIDTHS = [480, 960, 1280];
const AVIF = { quality: 52, effort: 4 };
const WEBP = { quality: 78 };
/** Одновременных задач — по числу ядер минус одно, чтобы машина не вставала колом. */
const CONCURRENCY = Math.max(1, (await import("node:os")).cpus().length - 1);

const withVideo = process.argv.includes("--video");
const force = process.argv.includes("--force");

async function walk(dir) {
  const out = [];
  for (const entry of await readdir(dir, { withFileTypes: true })) {
    if (entry.name.startsWith(".")) continue;
    const path = join(dir, entry.name);
    if (entry.isDirectory()) out.push(...(await walk(path)));
    else out.push(path);
  }
  return out;
}

/** Готово, если файл на месте и новее исходника. */
async function isFresh(src, dest) {
  if (force || !existsSync(dest)) return false;
  const [a, b] = await Promise.all([stat(src), stat(dest)]);
  return b.mtimeMs >= a.mtimeMs;
}

async function processImage(src) {
  const rel = relative(RAW, src);
  const dir = join(OUT, dirname(rel));
  const name = basename(rel, extname(rel));
  await mkdir(dir, { recursive: true });

  const image = sharp(src, { failOn: "none" }).rotate(); // rotate() применяет EXIF-поворот и срезает метаданные
  const meta = await image.metadata();
  if (!meta.width || !meta.height) throw new Error(`не читается: ${src}`);

  const widths = WIDTHS.filter((w) => w <= meta.width);
  if (widths.length === 0) widths.push(meta.width);

  const variants = [];
  for (const w of widths) {
    for (const [ext, opts] of [
      ["avif", AVIF],
      ["webp", WEBP],
    ]) {
      const dest = join(dir, `${name}-${w}.${ext}`);
      if (!(await isFresh(src, dest))) {
        await image.clone().resize({ width: w })[ext](opts).toFile(dest);
      }
      variants.push({ width: w, format: ext, file: relative(OUT, dest) });
    }
  }

  const lqip = await image.clone().resize({ width: 20 }).blur(1).webp({ quality: 30 }).toBuffer();

  return {
    source: rel,
    width: meta.width,
    height: meta.height,
    aspectRatio: +(meta.width / meta.height).toFixed(4),
    variants,
    lqip: `data:image/webp;base64,${lqip.toString("base64")}`,
  };
}

async function processVideo(src) {
  const rel = relative(RAW, src);
  const dir = join(OUT, dirname(rel));
  const name = basename(rel, extname(rel));
  await mkdir(dir, { recursive: true });

  const dest = join(dir, `${name}.mp4`);
  const poster = join(dir, `${name}-poster.webp`);

  if (!(await isFresh(src, dest))) {
    // scale: ширина максимум 1280, высота кратна 2 (иначе H.264 ругается на нечётный размер)
    await run("ffmpeg", [
      "-y", "-i", src,
      "-vf", "scale='min(1280,iw)':-2",
      "-c:v", "libx264", "-preset", "slow", "-crf", "26",
      "-profile:v", "high", "-pix_fmt", "yuv420p",
      "-c:a", "aac", "-b:a", "96k",
      "-movflags", "+faststart",
      dest,
    ]);
  }
  if (!(await isFresh(src, poster))) {
    const tmp = join(dir, `${name}-poster.png`);
    await run("ffmpeg", ["-y", "-i", src, "-frames:v", "1", "-vf", "scale='min(1280,iw)':-2", tmp]);
    await sharp(tmp).webp({ quality: 72 }).toFile(poster);
    await run("rm", [tmp]);
  }

  return { source: rel, video: relative(OUT, dest), poster: relative(OUT, poster) };
}

/** Простой пул: держим не больше CONCURRENCY задач в полёте. */
async function pool(items, worker) {
  const results = [];
  let index = 0;
  let done = 0;
  await Promise.all(
    Array.from({ length: Math.min(CONCURRENCY, items.length) }, async () => {
      while (index < items.length) {
        const i = index++;
        try {
          results[i] = await worker(items[i]);
        } catch (error) {
          console.error(`  ✗ ${items[i]}: ${error.message}`);
          results[i] = null;
        }
        done++;
        if (done % 10 === 0 || done === items.length) {
          process.stdout.write(`\r  ${done}/${items.length}`);
        }
      }
    }),
  );
  process.stdout.write("\n");
  return results.filter(Boolean);
}

const files = await walk(RAW);
const images = files.filter((f) => /\.(jpe?g|png)$/i.test(f));
const videos = files.filter((f) => /\.(mp4|mov)$/i.test(f));

console.log(`Фото: ${images.length}, видео: ${videos.length} (потоков: ${CONCURRENCY})`);

console.log("Обрабатываю фото…");
const photoManifest = await pool(images, processImage);

let videoManifest = [];
if (withVideo && videos.length) {
  console.log("Обрабатываю видео…");
  videoManifest = await pool(videos, processVideo);
} else if (videos.length) {
  console.log(`Видео пропущено (${videos.length} файлов). Запустите с --video, когда понадобится.`);
}

await mkdir(OUT, { recursive: true });
await writeFile(
  join(OUT, "manifest.json"),
  JSON.stringify({ generatedFrom: RAW, images: photoManifest, videos: videoManifest }, null, 2) + "\n",
);

console.log(`Готово. Описание в ${join(OUT, "manifest.json")}`);
