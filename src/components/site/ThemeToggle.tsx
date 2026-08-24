"use client";

import { useSyncExternalStore } from "react";
import { useTranslations } from "next-intl";
import { MoonIcon, SunIcon } from "@/components/ui/icons";

type Theme = "light" | "dark";

const THEME_EVENT = "cargo:themechange";

/** Источник правды — сам документ: data-theme на <html>, который ставит inline-скрипт в layout. */
function subscribe(onChange: () => void) {
  const media = window.matchMedia("(prefers-color-scheme: dark)");
  media.addEventListener("change", onChange);
  window.addEventListener(THEME_EVENT, onChange);
  return () => {
    media.removeEventListener("change", onChange);
    window.removeEventListener(THEME_EVENT, onChange);
  };
}

function getTheme(): Theme {
  const explicit = document.documentElement.dataset.theme;
  if (explicit === "dark" || explicit === "light") return explicit;
  return window.matchMedia("(prefers-color-scheme: dark)").matches ? "dark" : "light";
}

/** На сервере темы ещё нет — рисуем светлый вариант, до гидрации иконка всё равно не кликается. */
function getServerTheme(): Theme {
  return "light";
}

export function ThemeToggle({ className = "" }: { className?: string }) {
  const t = useTranslations("theme");
  const theme = useSyncExternalStore(subscribe, getTheme, getServerTheme);
  const isDark = theme === "dark";

  function toggle() {
    const next: Theme = isDark ? "light" : "dark";
    document.documentElement.dataset.theme = next;
    localStorage.setItem("theme", next);
    window.dispatchEvent(new Event(THEME_EVENT));
  }

  return (
    <button
      type="button"
      onClick={toggle}
      aria-label={isDark ? t("toLight") : t("toDark")}
      className={`rounded-control border-border text-text-secondary hover:text-text flex size-11 cursor-pointer items-center justify-center border transition-colors duration-200 ${className}`}
    >
      {isDark ? <SunIcon className="size-5" /> : <MoonIcon className="size-5" />}
    </button>
  );
}
