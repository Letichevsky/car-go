"use client";

import { useEffect, useState, type ReactNode } from "react";
import { usePathname } from "next/navigation";

/** Дрожание пальца на телефоне не должно прятать шапку — реагируем только на заметный сдвиг */
const NOISE = 6;
/** Первые пиксели прокрутки шапку не трогают: на первом экране она нужна всегда */
const HIDE_AFTER = 120;

/**
 * Шапка уезжает вверх, когда человек листает вниз, и возвращается на первом же
 * движении вверх — так она не занимает место при чтении, но всегда под рукой.
 */
export function StickyHeader({ children }: { children: ReactNode }) {
  const pathname = usePathname();
  const [hidden, setHidden] = useState(false);
  const [scrolled, setScrolled] = useState(false);
  const [shownFor, setShownFor] = useState(pathname);

  // На новой странице шапка обязана быть видимой: React переиспользует этот
  // компонент между переходами, и спрятанное состояние переехало бы вместе с ним —
  // человек оказывался бы наверху страницы без шапки, а та выезжала бы поверх текста.
  if (shownFor !== pathname) {
    setShownFor(pathname);
    setHidden(false);
    setScrolled(false);
  }

  useEffect(() => {
    let last = window.scrollY;

    const onScroll = () => {
      const y = window.scrollY;
      const delta = y - last;

      setScrolled(y > 8);

      if (Math.abs(delta) < NOISE) return;
      setHidden(delta > 0 && y > HIDE_AFTER);
      last = y;
    };

    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  return (
    <div
      className={`bg-bg/95 sticky top-0 z-40 backdrop-blur transition-transform duration-300 ease-out ${
        scrolled ? "border-border border-b" : "border-b border-transparent"
      }`}
      style={{ transform: hidden ? "translateY(-100%)" : "none" }}
    >
      {children}
    </div>
  );
}
