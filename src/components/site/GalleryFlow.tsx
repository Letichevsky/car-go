"use client";

import { useCallback, useEffect, useMemo, useState, type CSSProperties } from "react";
import { useTranslations } from "next-intl";
import { Tile } from "@/components/site/PhotoTile";
import { photos as allPhotos } from "@/lib/photos";
import { useReducedMotion } from "@/lib/useReducedMotion";

/**
 * Та же мозаика, что и в статичном варианте, только выложенная в горизонтальную полосу
 * и бесконечно едущая влево. Полоса дублируется, и трек сдвигается ровно на половину —
 * шов не виден, а движение целиком на CSS, то есть на видеокарте.
 */
const layout = [
  { c: 2, r: 2, prefer: "landscape" },
  { c: 1, r: 1, prefer: "any" },
  { c: 1, r: 2, prefer: "portrait" },
  { c: 1, r: 1, prefer: "any" },
  { c: 2, r: 1, prefer: "landscape" },
  { c: 1, r: 1, prefer: "any" },
  { c: 1, r: 1, prefer: "any" },
  { c: 2, r: 2, prefer: "landscape" },
  { c: 1, r: 2, prefer: "portrait" },
  { c: 1, r: 1, prefer: "any" },
  { c: 1, r: 1, prefer: "any" },
  { c: 2, r: 1, prefer: "landscape" },
  { c: 1, r: 1, prefer: "any" },
  { c: 2, r: 2, prefer: "landscape" },
  { c: 1, r: 1, prefer: "any" },
  { c: 1, r: 2, prefer: "portrait" },
  { c: 1, r: 1, prefer: "any" },
  { c: 1, r: 1, prefer: "any" },
  { c: 2, r: 1, prefer: "landscape" },
  { c: 2, r: 2, prefer: "landscape" },
  { c: 1, r: 1, prefer: "any" },
  { c: 1, r: 1, prefer: "any" },
  { c: 1, r: 2, prefer: "portrait" },
  { c: 1, r: 1, prefer: "any" },
  { c: 2, r: 1, prefer: "landscape" },
  { c: 1, r: 1, prefer: "any" },
  { c: 2, r: 2, prefer: "landscape" },
  { c: 1, r: 1, prefer: "any" },
  { c: 1, r: 1, prefer: "any" },
  { c: 1, r: 1, prefer: "any" },
  { c: 2, r: 2, prefer: "landscape" },
  { c: 1, r: 1, prefer: "any" },
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
};

/** Кадр в плитке меняется сам раз в этот интервал */
const ROTATE_MS = 3600;
const WAVE_SIZE = 3;
const WAVE_STEP_MS = 260;

/** Сколько секунд полоса проезжает свою длину */
const TRAVEL_SECONDS = 120;

const TILE_SIZES = "(max-width: 640px) 30vw, (max-width: 1024px) 20vw, 14vw";

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

function categoryOf(slug: string): string {
  return allPhotos.find((photo) => photo.slug === slug)?.category ?? "process";
}

export function GalleryFlow() {
  const t = useTranslations();
  const initial = useMemo(() => pickInitial(), []);
  const [slots, setSlots] = useState<string[]>(initial);
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

    let pending: number[] = [];

    const timer = window.setInterval(() => {
      if (document.hidden) return;
      pending = [];

      const picked = new Set<number>();
      while (picked.size < WAVE_SIZE) picked.add(Math.floor(Math.random() * layout.length));

      [...picked].forEach((index, order) => {
        pending.push(window.setTimeout(() => rotateAt(index), order * WAVE_STEP_MS));
      });
    }, ROTATE_MS);

    return () => {
      window.clearInterval(timer);
      pending.forEach(window.clearTimeout);
    };
  }, [reduced, rotateAt]);

  /** Одна копия полосы: сетка растёт вправо, ряды фиксированы */
  const strip = (copy: number) => (
    <div
      className="grid auto-cols-[3.25rem] grid-flow-col-dense [grid-template-rows:repeat(4,3.25rem)] gap-1.5 sm:auto-cols-[4rem] sm:[grid-template-rows:repeat(4,4rem)] lg:auto-cols-[4.5rem] lg:[grid-template-rows:repeat(4,4.5rem)] lg:gap-2"
      aria-hidden={copy === 1}
    >
      {layout.map((tile, index) => (
        <Tile
          key={`${copy}-${index}`}
          slug={slots[index]}
          span={spanClass[`${tile.c}x${tile.r}`]}
          sizes={TILE_SIZES}
          alt={copy === 0 ? t(`gallery.alt.${categoryOf(slots[index])}`) : ""}
          delay={index * 24}
          onHover={reduced ? undefined : () => rotateAt(index)}
        />
      ))}
    </div>
  );

  return (
    <div className="marquee overflow-hidden">
      <div
        className="marquee-track flex w-max gap-1.5 lg:gap-2"
        style={{ "--marquee-duration": `${TRAVEL_SECONDS}s` } as CSSProperties}
      >
        {strip(0)}
        {strip(1)}
      </div>
    </div>
  );
}
