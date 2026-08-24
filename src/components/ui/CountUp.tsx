"use client";

import { useEffect, useRef, useState } from "react";
import { useLocale } from "next-intl";
import { useReducedMotion } from "@/lib/useReducedMotion";

type CountUpProps = {
  to: number;
  /** Откуда начинать счёт. Больше `to` — цифра бежит вниз */
  from?: number;
  /** Сколько знаков после запятой показывать (для целых — ноль) */
  fractionDigits?: number;
  durationMs?: number;
};

/** Замедление к концу: цифра быстро набирает и мягко останавливается на нужном значении */
function easeOutCubic(progress: number): number {
  return 1 - Math.pow(1 - progress, 3);
}

/**
 * Число, которое добегает до значения, когда блок появляется на экране.
 *
 * По умолчанию в разметке стоит конечное число: так его видят поисковик и человек
 * с отключённым JS. Обнуляем и запускаем счёт только в момент, когда блок входит
 * в кадр — к этому времени секция ещё проявляется, поэтому подмены не видно.
 * При системной настройке «уменьшить движение» число просто стоит на месте.
 */
export function CountUp({ to, from = 0, fractionDigits = 0, durationMs = 1500 }: CountUpProps) {
  const locale = useLocale();
  const reduced = useReducedMotion();
  const ref = useRef<HTMLSpanElement>(null);
  const [value, setValue] = useState(to);

  useEffect(() => {
    const node = ref.current;
    if (!node || reduced) return;

    let frame = 0;
    let start = 0;

    const step = (time: number) => {
      if (!start) start = time;
      const progress = Math.min((time - start) / durationMs, 1);
      setValue(from + (to - from) * easeOutCubic(progress));
      if (progress < 1) frame = requestAnimationFrame(step);
    };

    const observer = new IntersectionObserver(
      (entries) => {
        if (!entries.some((entry) => entry.isIntersecting)) return;
        observer.disconnect();
        setValue(from);
        frame = requestAnimationFrame(step);
      },
      { threshold: 0.01, rootMargin: "0px 0px -10% 0px" },
    );

    observer.observe(node);

    return () => {
      observer.disconnect();
      cancelAnimationFrame(frame);
    };
  }, [to, from, durationMs, reduced]);

  const formatted = new Intl.NumberFormat(locale, {
    minimumFractionDigits: fractionDigits,
    maximumFractionDigits: fractionDigits,
  }).format(reduced ? to : value);

  return (
    <span ref={ref} className="tabular-nums">
      {formatted}
    </span>
  );
}
