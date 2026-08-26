"use client";

import { useEffect, useRef } from "react";
import brand from "@/data/brand.json";
import { useReducedMotion } from "@/lib/useReducedMotion";

const SIZES = "(max-width: 1024px) 118vw, 86vw";

/**
 * Фургон фоном первого экрана.
 *
 * По мере прокрутки уезжает влево и к тому моменту, когда первый экран пройден
 * целиком, полностью скрывается за левым краем. Доля пройденного пишется в
 * CSS-переменную, а сдвиг считает уже CSS — трогаем только `transform`,
 * раскладка не пересчитывается и всё остаётся на видеокарте.
 *
 * Пересчёт привязан к кадру, а слушатель прокрутки живёт только пока первый
 * экран в кадре: ниже по странице фургон всё равно за краем.
 *
 * При системном «уменьшить движение» фургон просто стоит на месте.
 */
export function BusBackdrop() {
  const ref = useRef<HTMLDivElement>(null);
  const reduced = useReducedMotion();

  useEffect(() => {
    const node = ref.current;
    const hero = node?.closest("section");
    if (!node || !hero || reduced) return;

    let frame = 0;

    const apply = () => {
      frame = 0;
      const rect = hero.getBoundingClientRect();
      // 0 — первый экран на месте, 1 — прокручен ровно на свою высоту
      const progress = Math.min(1, Math.max(0, -rect.top / rect.height));
      node.style.setProperty("--bus-progress", progress.toFixed(4));
    };

    const schedule = () => {
      if (!frame) frame = window.requestAnimationFrame(apply);
    };

    const watcher = new IntersectionObserver(([entry]) => {
      if (entry.isIntersecting) {
        window.addEventListener("scroll", schedule, { passive: true });
      } else {
        window.removeEventListener("scroll", schedule);
      }
      // и на входе, и на выходе доводим значение до края
      schedule();
    });

    watcher.observe(hero);
    window.addEventListener("resize", schedule, { passive: true });
    apply();

    return () => {
      watcher.disconnect();
      window.removeEventListener("scroll", schedule);
      window.removeEventListener("resize", schedule);
      window.cancelAnimationFrame(frame);
    };
  }, [reduced]);

  const srcSet = (format: string) =>
    brand.bus.widths.map((width) => `/brand/bus-${width}.${format} ${width}w`).join(", ");

  return (
    <div ref={ref} aria-hidden className="hero-bus">
      <picture>
        <source type="image/avif" srcSet={srcSet("avif")} sizes={SIZES} />
        <img
          src="/brand/bus-1600.webp"
          srcSet={srcSet("webp")}
          sizes={SIZES}
          alt=""
          decoding="async"
          fetchPriority="low"
          width={brand.bus.width}
          height={brand.bus.height}
        />
      </picture>
    </div>
  );
}
