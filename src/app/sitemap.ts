import type { MetadataRoute } from "next";
import { routing, type Locale } from "@/i18n/routing";
import { contactsSlugs, worksSlug } from "@/data/routes";
import { services } from "@/data/services";
import { siteUrl } from "@/lib/site";

/**
 * Карта сайта: каждая страница на каждом из четырёх языков, с перекрёстными hreflang.
 * Адреса локализованы, поэтому путь считается функцией от локали, а не константой.
 */
type Entry = { path: (locale: Locale) => string; priority: number };

const pages: Entry[] = [
  { path: () => "", priority: 1 },
  { path: (locale) => `/${contactsSlugs[locale]}`, priority: 0.7 },
  { path: () => `/${worksSlug}`, priority: 0.6 },
  ...services.map((service) => ({
    path: (locale: Locale) => `/${service.slugs[locale]}`,
    priority: 0.8,
  })),
];

export default function sitemap(): MetadataRoute.Sitemap {
  return routing.locales.flatMap((locale) =>
    pages.map((page) => ({
      url: `${siteUrl}/${locale}${page.path(locale)}`,
      changeFrequency: "monthly" as const,
      priority: page.priority,
      alternates: {
        languages: Object.fromEntries(
          routing.locales.map((item) => [item, `${siteUrl}/${item}${page.path(item)}`]),
        ),
      },
    })),
  );
}
