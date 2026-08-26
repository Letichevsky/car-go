"use client";

import { useEffect, useRef, useState } from "react";
import { useLocale, useTranslations } from "next-intl";
import { ChevronRightIcon } from "@/components/ui/icons";
import { Link } from "@/i18n/navigation";
import type { Locale } from "@/i18n/routing";
import { serviceIcons } from "@/components/ui/serviceIcons";
import { services, servicePath } from "@/data/services";

/** Небольшая задержка на закрытие, чтобы панель не мигала при переходе к ней курсором */
const CLOSE_MS = 120;

/**
 * Пункт «Услуги» в шапке с выпадающим списком направлений.
 *
 * Раскрывается по наведению и по фокусу с клавиатуры (`onFocus`/`onBlur` в React
 * поднимаются вверх, поэтому достаточно повесить их на обёртку). Сама ссылка
 * никуда не девается: нажатие по ней по-прежнему ведёт к секции услуг на главной,
 * а список — способ попасть сразу на нужную страницу.
 */
export function ServicesNav() {
  const t = useTranslations();
  const locale = useLocale() as Locale;
  const [open, setOpen] = useState(false);
  const timer = useRef<number | undefined>(undefined);

  useEffect(() => () => window.clearTimeout(timer.current), []);

  function show() {
    window.clearTimeout(timer.current);
    setOpen(true);
  }

  function hide() {
    timer.current = window.setTimeout(() => setOpen(false), CLOSE_MS);
  }

  return (
    <div
      className="relative"
      onMouseEnter={show}
      onMouseLeave={hide}
      onFocus={show}
      onBlur={hide}
      onKeyDown={(event) => {
        if (event.key === "Escape") setOpen(false);
      }}
    >
      <Link
        href="/#services"
        aria-expanded={open}
        onClick={() => setOpen(false)}
        className="hover:text-text flex items-center gap-1 whitespace-nowrap transition-colors duration-200"
      >
        {t("nav.services")}
        <ChevronRightIcon
          aria-hidden
          className={`text-chevron size-3.5 transition-transform duration-200 ${open ? "-rotate-90" : "rotate-90"}`}
        />
      </Link>

      {open && (
        <div className="border-border bg-bg shadow-card rounded-card absolute top-full left-0 z-50 mt-2 flex w-[20rem] flex-col gap-0.5 border p-2">
          {services.map((service) => {
            const Icon = serviceIcons[service.key];
            return (
              <Link
                key={service.key}
                href={servicePath(locale, service.key)}
                onClick={() => setOpen(false)}
                className="rounded-control text-text-secondary hover:bg-surface hover:text-info flex items-center gap-3 px-3 py-2.5 text-[0.9375rem] font-medium transition-colors duration-150"
              >
                <Icon className="text-info size-5 shrink-0" />
                {t(`services.${service.key}Title`)}
              </Link>
            );
          })}
        </div>
      )}
    </div>
  );
}
