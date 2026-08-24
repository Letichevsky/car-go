"use client";

import { useCallback, useEffect, useMemo, useRef, useState } from "react";
import { useTranslations } from "next-intl";
import { getPhoto, photos as allPhotos, srcSet } from "@/lib/photos";
import { useReducedMotion } from "@/lib/useReducedMotion";

/**
 * Раскладка мозаики: сколько колонок и строк занимает плитка.
 * Крупные ячейки достаются горизонтальным кадрам, высокие — вертикальным.
 * Сетка плотная (grid-flow-dense), поэтому дыр между плитками не остаётся.
 */
const layout = [
  { c: 3, r: 3, prefer: "landscape" },
  { c: 1, r: 1, prefer: "any" },
  { c: 1, r: 2, prefer: "portrait" },
  { c: 1, r: 1, prefer: "any" },
  { c: 2, r: 1, prefer: "landscape" },
  { c: 1, r: 1, prefer: "any" },
  { c: 1, r: 1, prefer: "any" },
  { c: 1, r: 2, prefer: "portrait" },
  { c: 2, r: 2, prefer: "landscape" },
  { c: 1, r: 1, prefer: "any" },
  { c: 1, r: 1, prefer: "any" },
  { c: 1, r: 1, prefer: "any" },
  { c: 2, r: 1, prefer: "landscape" },
  { c: 1, r: 2, prefer: "portrait" },
  { c: 1, r: 1, prefer: "any" },
  { c: 1, r: 1, prefer: "any" },
  { c: 1, r: 1, prefer: "any" },
  { c: 2, r: 1, prefer: "landscape" },
  { c: 1, r: 1, prefer: "any" },
  { c: 1, r: 2, prefer: "portrait" },
  { c: 1, r: 1, prefer: "any" },
  { c: 1, r: 1, prefer: "any" },
  { c: 2, r: 2, prefer: "landscape" },
  { c: 1, r: 1, prefer: "any" },
  { c: 1, r: 1, prefer: "any" },
  { c: 1, r: 1, prefer: "any" },
  { c: 1, r: 1, prefer: "any" },
  { c: 2, r: 1, prefer: "landscape" },
  { c: 1, r: 1, prefer: "any" },
  { c: 1, r: 1, prefer: "any" },
  { c: 1, r: 2, prefer: "portrait" },
  { c: 1, r: 1, prefer: "any" },
  { c: 1, r: 1, prefer: "any" },
  { c: 2, r: 1, prefer: "landscape" },
  { c: 1, r: 1, prefer: "any" },
  { c: 1, r: 1, prefer: "any" },
  { c: 1, r: 1, prefer: "any" },
  { c: 1, r: 1, prefer: "any" },
  { c: 1, r: 1, prefer: "any" },
  { c: 1, r: 1, prefer: "any" },
] as const;

const spanClass: Record<string, string> = {
  "1x1": "col-span-1 row-span-1",
  "1x2": "col-span-1 row-span-2",
  "2x1": "col-span-2 row-span-1",
  "2x2": "col-span-2 row-span-2",
  // единственная крупная плитка: на узких экранах ужимается, иначе съест весь первый ряд
  "3x3": "col-span-3 row-span-3 sm:col-span-3 sm:row-span-3",
};

/** Один кадр меняется раз в этот интервал — сетка живёт, но не мельтешит */
const ROTATE_MS = 3600;

/** Ширина плитки на экране: от неё зависит, какой вариант файла возьмёт браузер */
function sizesFor(columns: number): string {
  if (columns >= 3) return "(max-width: 640px) 75vw, (max-width: 1024px) 50vw, 38vw";
  if (columns === 2) return "(max-width: 640px) 50vw, (max-width: 1024px) 34vw, 26vw";
  return "(max-width: 640px) 25vw, (max-width: 1024px) 17vw, 13vw";
}

/** Начальная раскладка идёт по категориям по кругу, чтобы рядом не стояли похожие кадры */
function pickInitial(): string[] {
  const order = ["team", "process", "packing", "assembly", "result"];
  const used = new Set<string>();

  return layout.map((tile, index) => {
    const category = order[index % order.length];
    const fits = (photo: (typeof allPhotos)[number]) =>
      !used.has(photo.slug) && (tile.prefer === "any" || photo.orientation === tile.prefer);

    const match =
      allPhotos.find((photo) => photo.category === category && fits(photo)) ??
      allPhotos.find(fits) ??
      allPhotos.find((photo) => !used.has(photo.slug))!;

    used.add(match.slug);
    return match.slug;
  });
}

export function Gallery() {
  const t = useTranslations();
  const initial = useMemo(() => pickInitial(), []);
  const [slots, setSlots] = useState<string[]>(initial);
  const cursor = useRef(0);
  const reduced = useReducedMotion();

  const rotateAt = useCallback((index: number) => {
    setSlots((current) => {
      const tile = layout[index];
      const shown = new Set(current);
      const candidates = allPhotos.filter(
        (photo) =>
          !shown.has(photo.slug) && (tile.prefer === "any" || photo.orientation === tile.prefer),
      );
      const pool =
        candidates.length > 0 ? candidates : allPhotos.filter((photo) => !shown.has(photo.slug));
      if (pool.length === 0) return current;

      const next = [...current];
      next[index] = pool[Math.floor(Math.random() * pool.length)].slug;
      return next;
    });
  }, []);

  useEffect(() => {
    if (reduced) return;

    const timer = window.setInterval(() => {
      // вкладка в фоне — не жжём кадры впустую
      if (document.hidden) return;
      rotateAt(cursor.current % layout.length);
      cursor.current += 1;
    }, ROTATE_MS);

    return () => window.clearInterval(timer);
  }, [reduced, rotateAt]);

  return (
    <div className="grid grid-flow-dense auto-rows-[3.25rem] grid-cols-4 gap-[0.1875rem] sm:auto-rows-[4rem] sm:grid-cols-6 lg:auto-rows-[4.5rem] lg:grid-cols-8 lg:gap-1">
      {layout.map((tile, index) => (
        <Tile
          key={index}
          slug={slots[index]}
          span={spanClass[`${tile.c}x${tile.r}`]}
          sizes={sizesFor(tile.c)}
          alt={t(`gallery.alt.${categoryOf(slots[index])}`)}
          delay={index * 28}
          onHover={reduced ? undefined : () => rotateAt(index)}
        />
      ))}
    </div>
  );
}

function categoryOf(slug: string): string {
  return allPhotos.find((photo) => photo.slug === slug)?.category ?? "process";
}

/**
 * Смена кадра без вздрагивания: новый снимок сначала грузится в память,
 * и только потом проявляется поверх старого. Старый убираем, когда переход закончился,
 * поэтому ни пустого места, ни мыла из заглушки в кадре не появляется.
 */
function Tile({
  slug,
  span,
  sizes,
  alt,
  delay,
  onHover,
}: {
  slug: string;
  span: string;
  sizes: string;
  alt: string;
  delay: number;
  onHover?: () => void;
}) {
  const frame = useRef<HTMLElement>(null);
  const [base, setBase] = useState(slug);
  const [incoming, setIncoming] = useState<string | null>(null);
  const [axis, setAxis] = useState<"x" | "y">("x");

  useEffect(() => {
    if (slug === base) return;

    let cancelled = false;
    const photo = getPhoto(slug);

    const reveal = () => {
      if (cancelled) return;
      // длинная сторона именно у того прямоугольника, который видит человек
      const box = frame.current?.getBoundingClientRect();
      setAxis(box && box.height > box.width ? "y" : "x");
      setIncoming(slug);
    };

    const loader = new Image();
    loader.sizes = sizes;
    loader.onload = reveal;
    loader.onerror = () => {
      // формат не поддержан — пробуем webp; не выйдет и он, просто меняем кадр
      const fallback = new Image();
      fallback.sizes = sizes;
      fallback.onload = reveal;
      fallback.onerror = reveal;
      fallback.srcset = srcSet(photo, "webp");
    };
    loader.srcset = srcSet(photo, "avif");

    return () => {
      cancelled = true;
    };
  }, [slug, base, sizes]);

  const settle = useCallback(() => {
    setIncoming((current) => {
      if (current) setBase(current);
      return null;
    });
  }, []);

  // Подстраховка: если вкладка была в фоне и анимация не отыграла, слой всё равно схлопнется
  useEffect(() => {
    if (!incoming) return;
    const timer = window.setTimeout(settle, 1400);
    return () => window.clearTimeout(timer);
  }, [incoming, settle]);

  const backface = axis === "x" ? "rotateX(180deg)" : "rotateY(180deg)";

  return (
    <figure
      ref={frame}
      className={`bg-surface-strong relative overflow-hidden ${span}`}
      style={{
        animation: `tile-in 600ms cubic-bezier(0.22, 1, 0.36, 1) ${delay}ms both`,
        perspective: "40rem",
      }}
      onMouseEnter={onHover}
    >
      <div
        className="relative size-full"
        style={{
          transformStyle: "preserve-3d",
          animation: incoming
            ? `tile-flip-${axis} 720ms cubic-bezier(0.45, 0.05, 0.3, 1) both`
            : undefined,
        }}
        onAnimationEnd={settle}
      >
        <TileFace slug={base} alt={incoming ? "" : alt} sizes={sizes} />
        {incoming && (
          <TileFace key={incoming} slug={incoming} alt={alt} sizes={sizes} transform={backface} />
        )}
      </div>
    </figure>
  );
}

/**
 * Грань переворота. Трансформация и скрытие изнанки висят на <picture>:
 * если оставить их на <img>, тег picture создаст собственный плоский контекст,
 * и вместо обратной стороны будет видно зеркальную переднюю.
 */
function TileFace({
  slug,
  alt,
  sizes,
  transform,
}: {
  slug: string;
  alt: string;
  sizes: string;
  transform?: string;
}) {
  const photo = getPhoto(slug);
  const webp = photo.variants.filter((variant) => variant.format === "webp");

  return (
    <picture
      className="absolute inset-0 block size-full"
      style={{
        backfaceVisibility: "hidden",
        WebkitBackfaceVisibility: "hidden",
        transform,
      }}
    >
      <source type="image/avif" srcSet={srcSet(photo, "avif")} sizes={sizes} />
      <img
        src={webp[webp.length - 1]?.src}
        srcSet={srcSet(photo, "webp")}
        sizes={sizes}
        alt={alt}
        loading="lazy"
        decoding="async"
        className="size-full object-cover"
      />
    </picture>
  );
}
