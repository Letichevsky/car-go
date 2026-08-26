import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { hasLocale, NextIntlClientProvider } from "next-intl";
import { getTranslations, setRequestLocale } from "next-intl/server";
import { Plus_Jakarta_Sans } from "next/font/google";
import { ConsentDefaults, GoogleTagManager } from "@/components/analytics/Analytics";
import { AnalyticsClient } from "@/components/analytics/AnalyticsClient";
import { ConsentBanner } from "@/components/analytics/ConsentBanner";
import { AnchorScroll } from "@/components/site/AnchorScroll";
import { gtmId } from "@/lib/analytics";
import { routing, type Locale } from "@/i18n/routing";
import { siteUrl } from "@/lib/site";
import "../globals.css";

const jakarta = Plus_Jakarta_Sans({
  subsets: ["latin", "latin-ext", "cyrillic-ext"],
  weight: ["400", "500", "600", "700"],
  display: "swap",
  variable: "--font-jakarta",
});

export function generateStaticParams() {
  return routing.locales.map((locale) => ({ locale }));
}

export async function generateMetadata({
  params,
}: {
  params: Promise<{ locale: string }>;
}): Promise<Metadata> {
  const { locale } = await params;
  const t = await getTranslations({ locale, namespace: "meta" });

  // hreflang: у каждой локали свой адрес, поисковик видит их как одну страницу на четырёх языках
  const languages = Object.fromEntries(routing.locales.map((item) => [item, `/${item}`]));

  return {
    metadataBase: new URL(siteUrl),
    title: t("title"),
    description: t("description"),
    alternates: { canonical: `/${locale}`, languages },
    openGraph: {
      title: t("title"),
      description: t("description"),
      locale,
      type: "website",
    },
  };
}

/** Ставит выбранную ранее тему до первой отрисовки — иначе страница мигает светлым. */
const themeScript = `try{var t=localStorage.getItem("theme");if(t==="dark"||t==="light"){document.documentElement.dataset.theme=t}}catch(e){}`;

export default async function LocaleLayout({
  children,
  params,
}: {
  children: React.ReactNode;
  params: Promise<{ locale: string }>;
}) {
  const { locale } = await params;
  if (!hasLocale(routing.locales, locale)) notFound();

  setRequestLocale(locale as Locale);

  return (
    // data-scroll-behavior: у нас scroll-behavior: smooth, и без этого атрибута
    // Next не гасит плавность на время перехода — прокрутка к началу новой
    // страницы превращалась в анимацию через всю ленту и не доезжала до верха
    <html lang={locale} data-scroll-behavior="smooth" suppressHydrationWarning>
      <head>
        <script dangerouslySetInnerHTML={{ __html: themeScript }} />
        {/* Дефолты Consent Mode — строго до загрузки любых тегов */}
        <ConsentDefaults />
        {/* Без JS появления не сработают — показываем содержимое сразу */}
        <noscript>
          <style>{`[data-reveal]{opacity:1 !important;transform:none !important}`}</style>
        </noscript>
      </head>
      <body className={`${jakarta.variable} font-sans`}>
        <GoogleTagManager />
        <NextIntlClientProvider>
          {children}
          {gtmId ? <ConsentBanner /> : null}
        </NextIntlClientProvider>
        <AnalyticsClient />
        <AnchorScroll />
      </body>
    </html>
  );
}
