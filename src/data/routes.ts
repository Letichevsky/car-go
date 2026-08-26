import { routing, type Locale } from "@/i18n/routing";
import { services, type ServiceKey } from "@/data/services";

/**
 * Таблица локализованных адресов верхнего уровня.
 *
 * Один динамический маршрут `/[locale]/[slug]` обслуживает и услуги, и контакты:
 * по слагу смотрим сюда и решаем, какой шаблон рисовать. Новая локализованная
 * страница добавляется строкой в таблицу, а не новой папкой на каждый язык.
 */
export type PageRoute = { kind: "service"; key: ServiceKey } | { kind: "contacts" };

/** Адрес страницы контактов по локалям */
export const contactsSlugs: Record<Locale, string> = {
  pt: "contactos",
  en: "contacts",
  ru: "contacts",
  uk: "contacts",
};

/** Страница работ пока одна на все языки */
export const worksSlug = "works";

export function contactsPath(locale: Locale): string {
  return `/${contactsSlugs[locale]}`;
}

function tableFor(locale: Locale): Record<string, PageRoute> {
  const table: Record<string, PageRoute> = {
    [contactsSlugs[locale]]: { kind: "contacts" },
  };
  for (const service of services) {
    table[service.slugs[locale]] = { kind: "service", key: service.key };
  }
  return table;
}

export function resolveRoute(locale: Locale, slug: string): PageRoute | undefined {
  return tableFor(locale)[slug];
}

/** Все пары «локаль + слаг» для статической генерации */
export function allRouteParams(): { locale: Locale; slug: string }[] {
  return routing.locales.flatMap((locale) =>
    Object.keys(tableFor(locale)).map((slug) => ({ locale, slug })),
  );
}

/** Адреса одной и той же страницы на всех языках — для hreflang */
export function alternatesFor(route: PageRoute): Record<Locale, string> {
  const entries = routing.locales.map((locale) => {
    const slug =
      route.kind === "contacts"
        ? contactsSlugs[locale]
        : services.find((service) => service.key === route.key)!.slugs[locale];
    return [locale, `/${locale}/${slug}`] as const;
  });
  return Object.fromEntries(entries) as Record<Locale, string>;
}
