import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { getTranslations, setRequestLocale } from "next-intl/server";
import { ContactsPage } from "@/components/pages/ContactsPage";
import { ServicePage } from "@/components/pages/ServicePage";
import { allRouteParams, alternatesFor, resolveRoute } from "@/data/routes";
import type { Locale } from "@/i18n/routing";

/**
 * Один маршрут на все локализованные страницы верхнего уровня.
 *
 * Адрес у каждой локали свой (`/pt/mudancas`, `/en/house-moves`), поэтому статическую
 * папку под каждую страницу завести нельзя — слаг разрешается по таблице в
 * `src/data/routes.ts`. Всё, чего в таблице нет, отдаёт 404.
 */
type PageParams = { locale: string; slug: string };

export function generateStaticParams() {
  return allRouteParams();
}

export async function generateMetadata({
  params,
}: {
  params: Promise<PageParams>;
}): Promise<Metadata> {
  const { locale, slug } = await params;
  const route = resolveRoute(locale as Locale, slug);
  if (!route) return {};

  const namespace = route.kind === "contacts" ? "contactsPage" : `servicePages.items.${route.key}`;
  const t = await getTranslations({ locale, namespace });

  return {
    title: t("metaTitle"),
    description: t("metaDescription"),
    alternates: { canonical: `/${locale}/${slug}`, languages: alternatesFor(route) },
    openGraph: {
      title: t("metaTitle"),
      description: t("metaDescription"),
      locale,
      type: "website",
    },
  };
}

export default async function LocalizedPage({ params }: { params: Promise<PageParams> }) {
  const { locale, slug } = await params;
  const route = resolveRoute(locale as Locale, slug);
  if (!route) notFound();

  setRequestLocale(locale as Locale);

  return route.kind === "contacts" ? (
    <ContactsPage locale={locale as Locale} />
  ) : (
    <ServicePage locale={locale as Locale} serviceKey={route.key} />
  );
}
