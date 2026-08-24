import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { getTranslations, setRequestLocale } from "next-intl/server";
import { CtaBanner } from "@/components/site/CtaBanner";
import { LeadForm } from "@/components/site/LeadForm";
import { MobileActionBar } from "@/components/site/MobileActionBar";
import { SiteFooter } from "@/components/site/SiteFooter";
import { SiteHeader } from "@/components/site/SiteHeader";
import { Photo } from "@/components/ui/Photo";
import { Reveal } from "@/components/ui/Reveal";
import { ArrowRightIcon, CheckIcon, ChevronRightIcon } from "@/components/ui/icons";
import { Link } from "@/i18n/navigation";
import { routing, type Locale } from "@/i18n/routing";
import { findService, services } from "@/data/services";
import { photosByCategory } from "@/lib/photos";

type PageParams = { locale: string; slug: string };

export function generateStaticParams() {
  return routing.locales.flatMap((locale) =>
    services.map((service) => ({ locale, slug: service.slug })),
  );
}

export async function generateMetadata({
  params,
}: {
  params: Promise<PageParams>;
}): Promise<Metadata> {
  const { locale, slug } = await params;
  const service = findService(slug);
  if (!service) return {};

  const t = await getTranslations({ locale, namespace: `servicePages.items.${service.key}` });
  const languages = Object.fromEntries(
    routing.locales.map((item) => [item, `/${item}/services/${slug}`]),
  );

  return {
    title: t("metaTitle"),
    description: t("metaDescription"),
    alternates: { canonical: `/${locale}/services/${slug}`, languages },
    openGraph: {
      title: t("metaTitle"),
      description: t("metaDescription"),
      locale,
      type: "website",
    },
  };
}

export default async function ServicePage({ params }: { params: Promise<PageParams> }) {
  const { locale, slug } = await params;
  const service = findService(slug);
  if (!service) notFound();

  setRequestLocale(locale as Locale);

  const t = await getTranslations({ locale });
  const item = (key: string) => t(`servicePages.items.${service.key}.${key}`);

  const includes = t.raw(`servicePages.items.${service.key}.includes`) as string[];
  const faq = t.raw(`servicePages.items.${service.key}.faq`) as { q: string; a: string }[];
  const steps = t.raw("servicePages.common.steps") as { title: string; text: string }[];

  const gallery = photosByCategory(service.photos).slice(0, 4);
  const others = services.filter((other) => other.slug !== service.slug);

  // Разметка услуги и вопросов: расширенный сниппет в поиске тянется именно отсюда
  const jsonLd = [
    {
      "@context": "https://schema.org",
      "@type": "Service",
      name: item("title"),
      description: item("metaDescription"),
      serviceType: item("title"),
      areaServed: [
        { "@type": "City", name: "Lisboa" },
        { "@type": "Country", name: "Portugal" },
      ],
      provider: { "@type": "MovingCompany", name: "Car-Go!" },
    },
    {
      "@context": "https://schema.org",
      "@type": "FAQPage",
      mainEntity: faq.map((entry) => ({
        "@type": "Question",
        name: entry.q,
        acceptedAnswer: { "@type": "Answer", text: entry.a },
      })),
    },
  ];

  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
      />
      <SiteHeader />

      <main>
        {/* Первый экран услуги: обещание, заявка и один кадр с работы */}
        <section className="mx-auto w-full max-w-7xl px-5 pt-6 pb-12 lg:px-14 lg:pt-10 lg:pb-16">
          <nav
            aria-label="breadcrumb"
            className="text-text-muted mb-6 flex items-center gap-2 text-[0.8125rem]"
          >
            <Link href="/" className="hover:text-info transition duration-200">
              {t("nav.home")}
            </Link>
            <ChevronRightIcon className="size-3.5" />
            <span className="text-text-secondary">{item("title")}</span>
          </nav>

          <div className="grid gap-10 lg:grid-cols-[1.15fr_0.85fr] lg:gap-14">
            <div className="flex flex-col gap-6">
              <Reveal immediate from="left">
                <h1 className="text-[2.25rem] leading-[1.1] font-bold tracking-[-0.035em] text-balance lg:text-[3.25rem]">
                  {item("title")}
                </h1>
              </Reveal>
              <Reveal immediate from="left" delay={90}>
                <p className="text-text-secondary max-w-[36rem] text-lg leading-relaxed">
                  {item("lead")}
                </p>
              </Reveal>
              <Reveal immediate from="up" delay={180}>
                <div className="max-w-[34rem]">
                  <LeadForm buttonLabel={t("actions.getQuote")} />
                </div>
              </Reveal>
            </div>

            <Reveal immediate from="right" delay={140}>
              <div className="bg-surface-strong aspect-[4/3] overflow-hidden lg:aspect-[5/4]">
                {gallery[0] && (
                  <Photo
                    slug={gallery[0].slug}
                    alt={t(`gallery.alt.${gallery[0].category}`)}
                    sizes="(max-width: 1024px) 100vw, 34rem"
                    className="size-full object-cover"
                    priority
                  />
                )}
              </div>
            </Reveal>
          </div>
        </section>

        {/* Что входит */}
        <section className="mx-auto w-full max-w-7xl px-5 pb-14 lg:px-14 lg:pb-16">
          <Reveal from="up">
            <div className="border-border bg-surface rounded-card flex flex-col gap-6 border p-6 lg:p-10">
              <h2 className="text-[1.5rem] font-bold tracking-[-0.03em] lg:text-3xl">
                {t("servicePages.common.includesTitle")}
              </h2>
              <ul className="grid gap-4 sm:grid-cols-2">
                {includes.map((line) => (
                  <li
                    key={line}
                    className="flex items-start gap-3 text-[1.0625rem] leading-relaxed"
                  >
                    <CheckIcon className="text-info mt-1 size-5 shrink-0" />
                    <span>{line}</span>
                  </li>
                ))}
              </ul>
            </div>
          </Reveal>
        </section>

        {/* Как проходит */}
        <section className="mx-auto w-full max-w-7xl px-5 pb-14 lg:px-14 lg:pb-16">
          <Reveal from="up">
            <h2 className="mb-7 text-[1.75rem] font-bold tracking-[-0.035em] lg:text-4xl">
              {t("servicePages.common.stepsTitle")}
            </h2>
          </Reveal>
          <div className="grid gap-8 lg:grid-cols-3 lg:gap-12">
            {steps.map((step, index) => (
              <Reveal key={step.title} from="up" delay={index * 90}>
                <div
                  className={`flex flex-col gap-3 border-t-2 pt-5 ${index === 0 ? "border-action" : "border-border"}`}
                >
                  <span className="text-text-muted text-sm font-semibold">
                    {String(index + 1).padStart(2, "0")}
                  </span>
                  <h3 className="text-xl font-bold">{step.title}</h3>
                  <p className="text-text-secondary leading-relaxed">{step.text}</p>
                </div>
              </Reveal>
            ))}
          </div>
        </section>

        {/* Кадры с этой работы */}
        {gallery.length > 1 && (
          <section className="mx-auto w-full max-w-7xl px-5 pb-14 lg:px-14 lg:pb-16">
            <Reveal from="up">
              <div className="grid grid-cols-2 gap-1 lg:grid-cols-3 lg:gap-1.5">
                {gallery.slice(1).map((photo) => (
                  <figure
                    key={photo.slug}
                    className="bg-surface-strong aspect-[4/3] overflow-hidden"
                  >
                    <Photo
                      slug={photo.slug}
                      alt={t(`gallery.alt.${photo.category}`)}
                      sizes="(max-width: 640px) 50vw, 30vw"
                      className="size-full object-cover"
                    />
                  </figure>
                ))}
              </div>
            </Reveal>
          </section>
        )}

        {/* Частые вопросы */}
        <section className="mx-auto w-full max-w-7xl px-5 pb-14 lg:px-14 lg:pb-16">
          <Reveal from="up">
            <h2 className="mb-7 text-[1.75rem] font-bold tracking-[-0.035em] lg:text-4xl">
              {t("servicePages.common.faqTitle")}
            </h2>
          </Reveal>
          <div className="flex flex-col">
            {faq.map((entry, index) => (
              <Reveal key={entry.q} from="up" delay={index * 80}>
                <div className="border-border grid gap-2 border-t py-6 lg:grid-cols-[0.9fr_1.1fr] lg:gap-10">
                  <h3 className="text-lg font-bold">{entry.q}</h3>
                  <p className="text-text-secondary leading-relaxed">{entry.a}</p>
                </div>
              </Reveal>
            ))}
          </div>
        </section>

        {/* Перелинковка на остальные услуги */}
        <section className="mx-auto w-full max-w-7xl px-5 pb-14 lg:px-14 lg:pb-16">
          <Reveal from="up">
            <h2 className="mb-6 text-[1.5rem] font-bold tracking-[-0.03em] lg:text-3xl">
              {t("servicePages.common.otherTitle")}
            </h2>
          </Reveal>
          <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-4">
            {others.map((other, index) => (
              <Reveal key={other.slug} from="up" delay={index * 70}>
                <Link
                  href={`/services/${other.slug}`}
                  className="group border-border hover:border-info hover:shadow-card rounded-card flex h-full cursor-pointer flex-col justify-between gap-6 border p-5 transition duration-300 ease-out hover:-translate-y-1.5"
                >
                  <span className="text-[1.0625rem] leading-snug font-bold">
                    {t(`services.${other.key}Title`)}
                  </span>
                  <ArrowRightIcon className="text-info size-5 transition-transform duration-300 ease-out group-hover:translate-x-1" />
                </Link>
              </Reveal>
            ))}
          </div>
        </section>

        <CtaBanner />
      </main>

      <SiteFooter />
      <MobileActionBar />
    </>
  );
}
