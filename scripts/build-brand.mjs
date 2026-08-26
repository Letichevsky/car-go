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

/** Колесо, вырезанное из того же снимка фургона */
const WHEEL_SRC = "assets/brand/bus_wheel.png";
/** Снимок фургона в Фигме — 1422×800, экспорт ×2 */
const FIGMA_HEIGHT = 800;
const FIGMA_SCALE = 2;
/** Левый верхний угол каждого колеса в координатах Фигмы: слева и снизу кадра */
const WHEEL_ANCHORS = {
  front: { left: 194, bottom: 313 },
  rear: { left: 987, bottom: 313 },
};

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
const trimmedBus = await sharp("assets/brand/bus.png").trim().toBuffer({ resolveWithObject: true });
const busMeta = await sharp(trimmedBus.data).metadata();

for (const width of BUS_WIDTHS) {
  if (width > busMeta.width) continue;
  const resized = sharp(trimmedBus.data).resize({ width });
  await resized
    .clone()
    .avif({ quality: 55 })
    .toFile(path.join(OUT, `bus-${width}.avif`));
  await resized
    .clone()
    .webp({ quality: 78 })
    .toFile(path.join(OUT, `bus-${width}.webp`));
}

// --- колёса ----------------------------------------------------------------
const wheelMeta = await sharp(WHEEL_SRC).metadata();
await sharp(WHEEL_SRC).avif({ quality: 62 }).toFile(path.join(OUT, "wheel.avif"));
await sharp(WHEEL_SRC).webp({ quality: 82 }).toFile(path.join(OUT, "wheel.webp"));

/**
 * Куда посадить колёса. Заказчик вырезал колесо из того же снимка и дал точки
 * привязки в координатах Фигмы. Пересчитываем их в проценты от обрезанного
 * снимка: обрезка съела прозрачные поля, поэтому вычитаем её смещение, а
 * проценты не зависят от того, в какой ширине снимок потом покажется.
 */
const percent = (fraction) => Number((fraction * 100).toFixed(4));

const wheels = { size: wheelMeta.width, width: percent(wheelMeta.width / busMeta.width) };
for (const [key, anchor] of Object.entries(WHEEL_ANCHORS)) {
  const x = anchor.left * FIGMA_SCALE + trimmedBus.info.trimOffsetLeft;
  const y = (FIGMA_HEIGHT - anchor.bottom) * FIGMA_SCALE + trimmedBus.info.trimOffsetTop;
  wheels[key] = { left: percent(x / busMeta.width), top: percent(y / busMeta.height) };
}

// Размеры нужны разметке, чтобы зарезервировать место и не дёргать раскладку
await writeFile(
  "src/data/brand.json",
  JSON.stringify(
    {
      logo: { width: logoMeta.width, height: logoMeta.height },
      bus: { width: busMeta.width, height: busMeta.height, widths: BUS_WIDTHS },
      wheel: wheels,
    },
    null,
    2,
  ) + "\n",
);

console.log(`фургон: ${busMeta.width}×${busMeta.height} → ${BUS_WIDTHS.join(", ")}`);
console.log(`колесо: ${wheelMeta.width}×${wheelMeta.height}`, wheels);
