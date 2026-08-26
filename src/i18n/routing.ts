import { defineRouting } from "next-intl/routing";

/**
 * pt — основной рынок и язык по умолчанию.
 * ru/uk — диаспора, en — экспаты. Префикс в адресе есть у всех локалей,
 * включая португальскую: так у каждой страницы один канонический URL на язык.
 */
export const routing = defineRouting({
  locales: ["pt", "en", "ru", "uk"],
  defaultLocale: "pt",
  localePrefix: "always",
});

export type Locale = (typeof routing.locales)[number];

export const localeNames: Record<Locale, string> = {
  pt: "Português",
  en: "English",
  ru: "Русский",
  uk: "Українська",
};

/**
 * Подписи в переключателе языка.
 *
 * Код локали остаётся `uk` — это ISO 639-1 для украинского, он живёт в адресе,
 * в атрибуте lang и в hreflang, и менять его нельзя. А вот показывать его людям
 * нельзя тоже: «UK» читается как United Kingdom. Для глаз — `UA`.
 */
export const localeLabels: Record<Locale, string> = {
  pt: "PT",
  en: "EN",
  ru: "RU",
  uk: "UA",
};
