import type { Metadata } from "next";
import { getTranslations, setRequestLocale } from "next-intl/server";
import { MobileActionBar } from "@/components/site/MobileActionBar";
import { SiteFooter } from "@/components/site/SiteFooter";
import { SiteHeader } from "@/components/site/SiteHeader";
import { Photo } from "@/components/ui/Photo";
import { Reveal } from "@/components/ui/Reveal";
import { Link } from "@/i18n/navigation";
import { ArrowRightIcon } from "@/components/ui/icons";
import { photos } from "@/lib/photos";
import { routing, type Locale } from "@/i18n/routing";

export function generateStaticParams() {
  return routing.locales.map((locale) => ({ locale }));
}

export async function generateMetadata({
  params,
}: {
  params: Promise<{ locale: string }>;
}): Promise<Metadata> {
  const { locale } = await params;
  const t = await getTranslations({ locale, namespace: "works" });
  const languages = Object.fromEntries(routing.locales.map((item) => [item, `/${item}/works`]));

  return {
    title: t("metaTitle"),
    description: t("metaDescription"),
    alternates: { canonical: `/${locale}/works`, languages },
  };
}

export default async function WorksPage({ params }: { params: Promise<{ locale: string }> }) {
  const { locale } = await params;
  setRequestLocale(locale as Locale);

  const t = await getTranslations({ locale });

  return (
    <>
      <SiteHeader />
      <main className="mx-auto w-full max-w-7xl px-5 pb-20 lg:px-14">
        <div className="flex flex-col gap-3 py-10 lg:py-14">
          <h1 className="text-[2rem] font-bold tracking-[-0.035em] lg:text-5xl">
            {t("works.title")}
          </h1>
          <p className="text-text-secondary max-w-[42rem] text-lg leading-relaxed">
            {t("works.subtitle")}
          </p>
        </div>

        <div className="columns-2 gap-2 sm:columns-3 lg:columns-4 [&>*]:mb-2">
          {photos.map((photo, index) => (
            <Reveal key={photo.slug} from="up" delay={(index % 6) * 60}>
              <figure className="bg-surface-strong overflow-hidden">
                <Photo
                  slug={photo.slug}
                  alt={t(`gallery.alt.${photo.category}`)}
                  sizes="(max-width: 640px) 50vw, (max-width: 1024px) 33vw, 22rem"
                  className="w-full object-cover"
                  priority={index < 4}
                />
              </figure>
            </Reveal>
          ))}
        </div>

        <div className="border-border bg-surface rounded-card mt-10 flex flex-col gap-2 border border-dashed p-6">
          <span className="text-lg font-bold">{t("about.videoTitle")}</span>
          <span className="text-text-muted text-[0.9375rem]">{t("about.videoText")}</span>
        </div>

        <Link
          href="/"
          className="text-info hover:text-info-hover mt-8 inline-flex items-center gap-2 text-[0.9375rem] font-semibold transition-colors duration-200"
        >
          {t("works.back")}
          <ArrowRightIcon className="size-[1.0625rem]" />
        </Link>
      </main>
      <SiteFooter />
      <MobileActionBar />
    </>
  );
}
