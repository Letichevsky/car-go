#!/usr/bin/env node
/**
 * Собирает набор кадров для сайта из assets/optimized в public/photos
 * и описывает его в src/data/photos.json.
 *
 *   node scripts/build-photo-set.mjs
 *
 * В мозаике плитки мелкие, поэтому по умолчанию берём только ширины 480 и 960.
 * Ширину 1280 копируем лишь для кадров из FEATURED — тех, что показываются крупно.
 * Так набор весит вдвое меньше, а качество там, где оно видно, не страдает.
 *
 * Категории задаются по имени файла в CATEGORIES; всё остальное попадает в "process".
 */

import { readFile, writeFile, copyFile, mkdir, rm } from "node:fs/promises";
import { join } from "node:path";

const SMALL_WIDTHS = [240, 480, 960];

/** Кадры, которые где-то показываются крупно — им нужна ширина 1280 */
const FEATURED = new Set(["IMG_2394.JPG", "IMG_2397.JPG", "IMG_2401.JPG", "IMG_2436.JPG"]);

/** Ручная разметка: остальное уедет в "process" */
const CATEGORIES = {
  team: [
    "IMG_2279", "IMG_2295", "IMG_2315", "IMG_2316", "IMG_2317", "IMG_2318", "IMG_2320",
    "IMG_2394", "IMG_2397", "IMG_2431", "IMG_2432", "IMG_2436", "IMG_2457",
  ],
  packing: [
    "IMG_2263", "IMG_2264", "IMG_2265", "IMG_2267", "IMG_2268", "IMG_2269", "IMG_2286",
    "IMG_2287", "IMG_2289", "IMG_2292", "IMG_2293", "IMG_2294", "IMG_2321", "IMG_2322",
    "IMG_2323", "IMG_2324", "IMG_2325", "IMG_2328", "IMG_2329", "IMG_2330", "IMG_2391",
    "IMG_2392", "IMG_2393", "IMG_2441", "IMG_2442", "IMG_2443", "IMG_2444", "IMG_2445",
  ],
  assembly: [
    "IMG_2304", "IMG_2305", "IMG_2306", "IMG_2307", "IMG_2308", "IMG_2309", "IMG_2310",
    "IMG_2311", "IMG_2312", "IMG_2313", "IMG_2314", "IMG_2433", "IMG_2434", "IMG_2435",
    "IMG_2437", "IMG_2438", "IMG_2446", "IMG_2448", "IMG_2450", "IMG_2451", "IMG_2452",
    "IMG_2453", "IMG_2454", "IMG_2455", "IMG_2456",
  ],
  result: [
    "IMG_2241", "IMG_2243", "IMG_2398", "IMG_2399", "IMG_2401", "IMG_2402", "IMG_2405",
    "IMG_2411", "IMG_2412", "IMG_2416", "IMG_2417", "IMG_2418", "IMG_2419", "IMG_2460",
    "IMG_2461", "IMG_2462",
  ],
};

const categoryByName = new Map();
for (const [category, names] of Object.entries(CATEGORIES)) {
  for (const name of names) categoryByName.set(name, category);
}

/** IMG_2440 (2).JPG → img-2440-2 */
function slugFor(source) {
  return source
    .replace(/\.[^.]+$/, "")
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-|-$/g, "");
}

const manifest = JSON.parse(await readFile("assets/optimized/manifest.json", "utf8"));
await rm("public/photos", { recursive: true, force: true });
await mkdir("public/photos", { recursive: true });

const out = [];
for (const entry of manifest.images) {
  const base = entry.source.replace(/\.[^.]+$/, "");
  const slug = slugFor(entry.source);
  const featured = FEATURED.has(entry.source);
  const widths = featured ? [...SMALL_WIDTHS, 1280] : SMALL_WIDTHS;

  const variants = [];
  for (const variant of entry.variants) {
    if (!widths.includes(variant.width)) continue;
    const dest = `${slug}-${variant.width}.${variant.format}`;
    await copyFile(join("assets/optimized", variant.file), join("public/photos", dest));
    variants.push({ width: variant.width, format: variant.format, src: `/photos/${dest}` });
  }
  if (variants.length === 0) continue;

  out.push({
    slug,
    category: categoryByName.get(base) ?? "process",
    width: entry.width,
    height: entry.height,
    orientation: entry.width >= entry.height ? "landscape" : "portrait",
    lqip: entry.lqip,
    variants,
  });
}

await mkdir("src/data", { recursive: true });
await writeFile("src/data/photos.json", JSON.stringify(out, null, 2) + "\n");

const byCategory = out.reduce((acc, photo) => ({ ...acc, [photo.category]: (acc[photo.category] ?? 0) + 1 }), {});
console.log(`${out.length} кадров в наборе:`, byCategory);
console.log("горизонтальных:", out.filter((photo) => photo.orientation === "landscape").length);
