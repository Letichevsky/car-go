/**
 * Фирменные материалы → готовые файлы для сайта.
 *
 *   node scripts/build-brand.mjs
 *
 * Логотип: обрезаем прозрачные поля и растеризуем под размер в шапке (запас ×3
 * под ретину). Исходник — «вектор» только по расширению: внутри несколько тысяч
 * прямоугольников 1×1, то есть обведённый растр. Настоящий вектор всё ещё нужен.
 *
 * Фургон: снимок на прозрачном фоне, идёт фоном первого экрана. Отдаём AVIF и
 * WebP в четырёх ширинах — разметка выберет по sizes ровно нужную.
 */
import { mkdir, writeFile } from "node:fs/promises";
import path from "node:path";
import sharp from "sharp";

const OUT = "public/brand";
const BUS_WIDTHS = [640, 1024, 1600, 2048];
/** Высота логотипа в шапке × 3 — запас под плотные экраны */
const LOGO_HEIGHT = 156;

await mkdir(OUT, { recursive: true });

// --- логотип ---------------------------------------------------------------
const trimmed = await sharp("assets/brand/logo.svg", { density: 300 }).trim().toBuffer();
const light = await sharp(trimmed).resize({ height: LOGO_HEIGHT, fit: "inside" }).png().toBuffer();
const logoMeta = await sharp(light).metadata();

// Плоская заливка и резкие края: индексированный PNG втрое легче WebP (4 КБ против 15)
const asIcon = { palette: true, colors: 64, compressionLevel: 9 };
await sharp(light).png(asIcon).toFile(path.join(OUT, "logo-light.png"));
await sharp(await forDarkTheme(light))
  .png(asIcon)
  .toFile(path.join(OUT, "logo-dark.png"));

console.log(`логотип: ${logoMeta.width}×${logoMeta.height}`);

/**
 * Вариант для тёмной темы. Дом, человечки и подпись в логотипе почти чёрные —
 * на тёмном фоне их просто не видно. Инвертируем только серое: у синего и
 * красного размах между каналами большой, их не трогаем, иначе поедет бренд.
 */
async function forDarkTheme(input) {
  const { data, info } = await sharp(input)
    .ensureAlpha()
    .raw()
    .toBuffer({ resolveWithObject: true });

  for (let i = 0; i < data.length; i += info.channels) {
    const r = data[i];
    const g = data[i + 1];
    const b = data[i + 2];
    const spread = Math.max(r, g, b) - Math.min(r, g, b);
    if (spread > 40) continue; // цветное — оставляем как есть

    data[i] = 255 - r;
    data[i + 1] = 255 - g;
    data[i + 2] = 255 - b;
  }

  return sharp(data, { raw: { width: info.width, height: info.height, channels: info.channels } })
    .png()
    .toBuffer();
}

// --- фургон ----------------------------------------------------------------
const bus = sharp("assets/brand/bus.png").trim();
const busMeta = await sharp(await bus.clone().png().toBuffer()).metadata();

for (const width of BUS_WIDTHS) {
  if (width > busMeta.width) continue;
  const resized = sharp(await bus.clone().png().toBuffer()).resize({ width });
  await resized
    .clone()
    .avif({ quality: 55 })
    .toFile(path.join(OUT, `bus-${width}.avif`));
  await resized
    .clone()
    .webp({ quality: 78 })
    .toFile(path.join(OUT, `bus-${width}.webp`));
}

// Размеры нужны разметке, чтобы зарезервировать место и не дёргать раскладку
await writeFile(
  "src/data/brand.json",
  JSON.stringify(
    {
      logo: { width: logoMeta.width, height: logoMeta.height },
      bus: { width: busMeta.width, height: busMeta.height, widths: BUS_WIDTHS },
    },
    null,
    2,
  ) + "\n",
);

console.log(`фургон: ${busMeta.width}×${busMeta.height} → ${BUS_WIDTHS.join(", ")}`);
