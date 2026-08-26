"use client";

import { useEffect, useState } from "react";
import { useTranslations } from "next-intl";
import { ChevronRightIcon } from "@/components/ui/icons";

/**
 * Кнопка «наверх». Появляется, когда пройден экран, и живёт на каждой странице.
 *
 * Из разметки не убирается, а гасится прозрачностью — иначе не было бы плавного
 * появления и исчезновения. На телефоне поднята над липкой панелью действий,
 * чтобы не налезать на её кнопки.
 */
export function BackToTop() {
  const t = useTranslations("nav");
  const [visible, setVisible] = useState(false);

  useEffect(() => {
    let frame = 0;

    const check = () => {
      frame = 0;
      setVisible(window.scrollY > window.innerHeight);
    };

    const onScroll = () => {
      if (!frame) frame = window.requestAnimationFrame(check);
    };

    check();
    window.addEventListener("scroll", onScroll, { passive: true });
    window.addEventListener("resize", onScroll, { passive: true });

    return () => {
      window.removeEventListener("scroll", onScroll);
      window.removeEventListener("resize", onScroll);
      window.cancelAnimationFrame(frame);
    };
  }, []);

  return (
    <button
      type="button"
      aria-label={t("toTop")}
      aria-hidden={!visible}
      tabIndex={visible ? 0 : -1}
      onClick={() => {
        const reduced = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
        window.scrollTo({ top: 0, behavior: reduced ? "auto" : "smooth" });
      }}
      className={`border-border bg-bg/90 text-text-secondary hover:border-info hover:text-info shadow-card fixed right-4 bottom-[calc(5.75rem+env(safe-area-inset-bottom))] z-40 flex size-12 cursor-pointer items-center justify-center rounded-full border backdrop-blur transition duration-300 ease-out lg:right-6 lg:bottom-6 ${
        visible ? "translate-y-0 opacity-100" : "pointer-events-none translate-y-2 opacity-0"
      }`}
    >
      <ChevronRightIcon className="size-5 -rotate-90" />
    </button>
  );
}
