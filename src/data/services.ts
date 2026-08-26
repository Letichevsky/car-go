import type { Locale } from "@/i18n/routing";
import type { PhotoCategory } from "@/lib/photos";

/**
 * Направления работы. Каждому соответствует своя страница.
 *
 * Адрес страницы локализован: португальский рынок — основной, и там URL должен
 * читаться по-португальски (`/pt/mudancas`), это прямой сигнал для поиска.
 * Для en/ru/uk берём один английский адрес: кириллица в URL плохо переживает
 * пересылку в мессенджерах, а SEO-вес этих локалей несопоставим с pt.
 *
 * `key` — ключ в переводах, `photos` — из какой категории брать кадры,
 * `primary` — показывать ли карточкой в основной сетке на главной.
 */
export type ServiceKey =
  "home" | "turnkey" | "office" | "packing" | "assembly" | "equipment" | "delivery" | "loading";

export type Service = {
  key: ServiceKey;
  slugs: Record<Locale, string>;
  photos: PhotoCategory;
  primary: boolean;
};

/** pt-адрес отдельно, для остальных языков — общий английский */
function slugs(pt: string, intl: string): Record<Locale, string> {
  return { pt, en: intl, ru: intl, uk: intl };
}

export const services: Service[] = [
  {
    key: "home",
    slugs: slugs("mudancas", "house-moves"),
    photos: "result",
    primary: true,
  },
  {
    key: "turnkey",
    slugs: slugs("mudancas-chave-na-mao", "full-service-moves"),
    photos: "team",
    primary: true,
  },
  {
    key: "office",
    slugs: slugs("mudancas-escritorios", "office-moves"),
    photos: "process",
    primary: true,
  },
  {
    key: "packing",
    slugs: slugs("embalagem", "packing"),
    photos: "packing",
    primary: true,
  },
  {
    key: "assembly",
    slugs: slugs("desmontagem-montagem", "furniture-assembly"),
    photos: "assembly",
    primary: true,
  },
  {
    key: "equipment",
    slugs: slugs("transporte-equipamentos", "equipment-transport"),
    photos: "process",
    primary: true,
  },
  {
    key: "delivery",
    slugs: slugs("entregas-e-compras", "delivery"),
    photos: "result",
    primary: false,
  },
  {
    key: "loading",
    slugs: slugs("cargas-e-descargas", "loading"),
    photos: "process",
    primary: false,
  },
];

export function serviceBySlug(locale: Locale, slug: string): Service | undefined {
  return services.find((service) => service.slugs[locale] === slug);
}

export function serviceByKey(key: ServiceKey): Service {
  const service = services.find((item) => item.key === key);
  if (!service) throw new Error(`Нет услуги с ключом "${key}"`);
  return service;
}

/** Путь без префикса локали — его подставит next-intl Link */
export function servicePath(locale: Locale, key: ServiceKey): string {
  return `/${serviceByKey(key).slugs[locale]}`;
}
