import { getTranslations, setRequestLocale } from "next-intl/server";
import { Areas } from "@/components/site/Areas";
import { CtaBanner } from "@/components/site/CtaBanner";
import { Faq } from "@/components/site/Faq";
import { Hero } from "@/components/site/Hero";
import { HowItWorks } from "@/components/site/HowItWorks";
import { MobileActionBar } from "@/components/site/MobileActionBar";
import { PromiseBlock } from "@/components/site/Promise";
import { Reviews } from "@/components/site/Reviews";
import { WhyUs } from "@/components/site/WhyUs";
import { WorksSection } from "@/components/site/WorksSection";
import { About } from "@/components/site/About";
import { Services } from "@/components/site/Services";
import { SiteFooter } from "@/components/site/SiteFooter";
import { SiteHeader } from "@/components/site/SiteHeader";
import { Stats } from "@/components/site/Stats";
import { areas } from "@/data/areas";
import { contacts } from "@/lib/contacts";
import { siteUrl } from "@/lib/site";
import type { Locale } from "@/i18n/routing";

export default async function HomePage({ params }: { params: Promise<{ locale: string }> }) {
  const { locale } = await params;
  setRequestLocale(locale as Locale);

  const t = await getTranslations({ locale });
  const faq = t.raw("faq.items") as { q: string; a: string }[];

  // Разметка для поиска: локальный бизнес с зоной обслуживания и частые вопросы.
  // Адрес и часы работы добавим, когда получим их от заказчика.
  const jsonLd = [
    {
      "@context": "https://schema.org",
      "@type": "MovingCompany",
      name: "Car-Go!",
      description: t("meta.description"),
      telephone: contacts.phone,
      url: `${siteUrl}/${locale}`,
      areaServed: [
        ...areas.map((area) => ({ "@type": "City", name: area })),
        { "@type": "Country", name: "Portugal" },
      ],
      availableLanguage: ["pt", "en", "ru", "uk"],
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
        <Hero />
        <Stats />
        <Services />
        <Areas />
        <WorksSection />
        <About />
        <HowItWorks />
        <WhyUs />
        <Reviews />
        <PromiseBlock />
        <Faq />
        <CtaBanner />
      </main>
      <SiteFooter />
      {/* На первом экране уже есть красная кнопка в форме — панель ждёт секции услуг */}
      <MobileActionBar revealFrom="services" />
    </>
  );
}
