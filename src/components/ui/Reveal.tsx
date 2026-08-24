"use client";

import { useEffect, useRef, useState, type ReactNode } from "react";
import { useReducedMotion } from "@/lib/useReducedMotion";

type Direction = "up" | "left" | "right" | "none";

type RevealProps = {
  children: ReactNode;
  /** Откуда приезжает элемент */
  from?: Direction;
  /** Задержка в миллисекундах — ей выстраивается очередь появления */
  delay?: number;
  /** Появиться сразу после загрузки, не дожидаясь прокрутки (для первого экрана) */
  immediate?: boolean;
  className?: string;
};

const offsets: Record<Direction, string> = {
  up: "translate3d(0, 1.25rem, 0)",
  left: "translate3d(-1.5rem, 0, 0)",
  right: "translate3d(1.5rem, 0, 0)",
  none: "none",
};

/**
 * Появление элемента: прозрачность плюс небольшой сдвиг.
 * Анимируем только opacity и transform — они не вызывают пересчёт раскладки,
 * поэтому кадр не проседает даже на слабом телефоне.
 * При включённом «уменьшить движение» в системе элемент просто виден сразу.
 */
export function Reveal({
  children,
  from = "up",
  delay = 0,
  immediate = false,
  className = "",
}: RevealProps) {
  const ref = useRef<HTMLDivElement>(null);
  const reduced = useReducedMotion();
  const [shown, setShown] = useState(false);

  useEffect(() => {
    const node = ref.current;
    if (!node || reduced) return;

    if (immediate) {
      const timer = window.setTimeout(() => setShown(true), 40);
      return () => window.clearTimeout(timer);
    }

    const observer = new IntersectionObserver(
      (entries) => {
        if (entries.some((entry) => entry.isIntersecting)) {
          setShown(true);
          observer.disconnect();
        }
      },
      { rootMargin: "0px 0px -10% 0px", threshold: 0.05 },
    );

    observer.observe(node);
    return () => observer.disconnect();
  }, [immediate, reduced]);

  const visible = shown || reduced;

  return (
    <div
      ref={ref}
      data-reveal=""
      className={className}
      style={{
        opacity: visible ? 1 : 0,
        transform: visible ? "none" : offsets[from],
        transition: reduced
          ? undefined
          : `opacity 620ms cubic-bezier(0.22, 1, 0.36, 1) ${delay}ms, transform 620ms cubic-bezier(0.22, 1, 0.36, 1) ${delay}ms`,
        willChange: visible ? "auto" : "opacity, transform",
      }}
    >
      {children}
    </div>
  );
}
