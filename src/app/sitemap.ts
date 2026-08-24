import type { MetadataRoute } from "next";
import { routing } from "@/i18n/routing";
import { services } from "@/data/services";
import { siteUrl } from "@/lib/site";

/** Карта сайта: каждая страница на каждом из четырёх языков, с перекрёстными hreflang. */
export default function sitemap(): MetadataRoute.Sitemap {
  const paths = ["", "/works", ...services.map((service) => `/services/${service.slug}`)];

  return routing.locales.flatMap((locale) =>
    paths.map((path) => ({
      url: `${siteUrl}/${locale}${path}`,
      changeFrequency: "monthly" as const,
      priority: path === "" ? 1 : 0.8,
      alternates: {
        languages: Object.fromEntries(
          routing.locales.map((item) => [item, `${siteUrl}/${item}${path}`]),
        ),
      },
    })),
  );
}
