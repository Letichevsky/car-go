import { getTranslations, setRequestLocale } from "next-intl/server";
import { CtaBanner } from "@/components/site/CtaBanner";
import { Hero } from "@/components/site/Hero";
import { MobileActionBar } from "@/components/site/MobileActionBar";
import { WorksSection } from "@/components/site/WorksSection";
import { About } from "@/components/site/About";
import { Services } from "@/components/site/Services";
import { SiteFooter } from "@/components/site/SiteFooter";
import { SiteHeader } from "@/components/site/SiteHeader";
import { Stats } from "@/components/site/Stats";
import { contacts } from "@/lib/contacts";
import type { Locale } from "@/i18n/routing";

export default async function HomePage({ params }: { params: Promise<{ locale: string }> }) {
  const { locale } = await params;
  setRequestLocale(locale as Locale);

  const t = await getTranslations({ locale, namespace: "meta" });

  // Разметка для поиска: локальный бизнес с зоной обслуживания.
  // Адрес и часы работы добавим, когда получим их от заказчика.
  const jsonLd = {
    "@context": "https://schema.org",
    "@type": "MovingCompany",
    name: "Car-Go!",
    description: t("description"),
    telephone: contacts.phone,
    areaServed: [
      { "@type": "City", name: "Lisboa" },
      { "@type": "Country", name: "Portugal" },
    ],
    availableLanguage: ["pt", "en", "ru", "uk"],
  };

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
        <WorksSection />
        <Services />
        <About />
        <CtaBanner />
      </main>
      <SiteFooter />
      <MobileActionBar />
    </>
  );
}
