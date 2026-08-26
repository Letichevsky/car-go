"use client";

import type { ReactNode } from "react";
import { Link, usePathname } from "@/i18n/navigation";

/**
 * Ссылка на главную у знака Car-Go!.
 *
 * С любой другой страницы это обычный переход — роутер сам ставит нас наверх.
 * А если мы уже на главной, переход ничего бы не изменил, поэтому просто
 * прокручиваем к началу: нажатие на логотип всегда возвращает в верхнюю точку.
 */
export function HomeLink({ children, className }: { children: ReactNode; className?: string }) {
  const pathname = usePathname();

  return (
    <Link
      href="/"
      aria-label="Car-Go!"
      className={className}
      onClick={(event) => {
        if (pathname !== "/") return;

        // Next Link проверит defaultPrevented и не станет ничего делать
        event.preventDefault();
        const reduced = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
        window.scrollTo({ top: 0, behavior: reduced ? "auto" : "smooth" });
      }}
    >
      {children}
    </Link>
  );
}
