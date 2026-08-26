import { getTranslations } from "next-intl/server";
import { MobileActionBar } from "@/components/site/MobileActionBar";
import { LeadForm } from "@/components/site/LeadForm";
import { SiteFooter } from "@/components/site/SiteFooter";
import { SiteHeader } from "@/components/site/SiteHeader";
import { Reveal } from "@/components/ui/Reveal";
import { PhoneText } from "@/components/ui/PhoneText";
import { ChatIcon, ChevronRightIcon, PhoneIcon, PinIcon } from "@/components/ui/icons";
import { Link } from "@/i18n/navigation";
import type { Locale } from "@/i18n/routing";
import { areas } from "@/data/areas";
import { contacts } from "@/lib/contacts";
import { siteUrl } from "@/lib/site";

/**
 * Отдельная страница контактов: у рекламы должна быть посадочная страница,
 * где все каналы связи собраны в одном месте, а не разбросаны по подвалу.
 */
export async function ContactsPage({ locale }: { locale: Locale }) {
  const t = await getTranslations({ locale });

  const jsonLd = {
    "@context": "https://schema.org",
    "@type": "MovingCompany",
    name: "Car-Go!",
    description: t("contactsPage.metaDescription"),
    telephone: contacts.phone,
    url: `${siteUrl}/${locale}`,
    areaServed: [
      ...areas.map((area) => ({ "@type": "City", name: area })),
      { "@type": "Country", name: "Portugal" },
    ],
    availableLanguage: ["pt", "en", "ru", "uk"],
  };

  const channels = [
    {
      href: contacts.whatsappHref,
      external: true,
      Icon: ChatIcon,
      label: t("actions.whatsappShort"),
      value: contacts.phone,
    },
    {
      href: contacts.telegramHref,
      external: true,
      Icon: ChatIcon,
      label: "Telegram",
      value: contacts.telegram,
    },
  ];

  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
      />
      <SiteHeader />

      <main data-analytics-zone="contacts-page">
        <section className="mx-auto w-full max-w-7xl px-5 pt-6 pb-12 lg:px-14 lg:pt-10 lg:pb-16">
          <nav
            aria-label="breadcrumb"
            className="text-text-muted mb-6 flex items-center gap-2 text-[0.8125rem]"
          >
            <Link href="/" className="hover:text-info transition duration-200">
              {t("nav.home")}
            </Link>
            <ChevronRightIcon className="size-3.5" />
            <span className="text-text-secondary">{t("contactsPage.title")}</span>
          </nav>

          <div className="grid gap-10 lg:grid-cols-[1fr_1fr] lg:gap-14">
            <div className="flex flex-col gap-6">
              <Reveal immediate from="left">
                <h1 className="text-[2.25rem] leading-[1.1] font-bold tracking-[-0.035em] text-balance lg:text-[3.25rem]">
                  {t("contactsPage.title")}
                </h1>
              </Reveal>
              <Reveal immediate from="left" delay={90}>
                <p className="text-text-secondary max-w-[36rem] text-lg leading-relaxed">
                  {t("contactsPage.lead")}
                </p>
              </Reveal>

              <Reveal immediate from="left" delay={160}>
                <div className="flex flex-col gap-3">
                  <span className="text-text-muted text-[0.8125rem] tracking-wide uppercase">
                    {t("contactsPage.channelsTitle")}
                  </span>

                  <a
                    href={contacts.phoneHref}
                    className="group border-border hover:border-info hover:shadow-card rounded-card flex items-center gap-4 border p-5 transition duration-300 ease-out"
                  >
                    <PhoneIcon className="text-info size-6 shrink-0" />
                    <span className="flex flex-col">
                      <span className="text-text-muted text-[0.8125rem]">
                        {t("actions.callNow")}
                      </span>
                      <span className="text-lg font-bold">
                        <PhoneText />
                      </span>
                    </span>
                  </a>

                  {channels.map((channel) => (
                    <a
                      key={channel.label}
                      href={channel.href}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="group border-border hover:border-info hover:shadow-card rounded-card flex items-center gap-4 border p-5 transition duration-300 ease-out"
                    >
                      <channel.Icon className="text-info size-6 shrink-0" />
                      <span className="flex flex-col">
                        <span className="text-text-muted text-[0.8125rem]">{channel.label}</span>
                        <span className="text-lg font-bold">{channel.value}</span>
                      </span>
                    </a>
                  ))}
                </div>
              </Reveal>
            </div>

            <Reveal immediate from="right" delay={140}>
              <div className="border-border bg-surface rounded-card flex flex-col gap-6 border p-6 lg:p-8">
                {/* Подпись под полем рисует сама форма — второй раз её здесь не повторяем */}
                <h2 className="text-xl font-bold">{t("contactsPage.formTitle")}</h2>
                <LeadForm buttonLabel={t("actions.getQuote")} />

                <div className="bg-border h-px" />

                <div className="flex flex-col gap-1">
                  <span className="text-text-muted text-[0.8125rem] tracking-wide uppercase">
                    {t("contactsPage.scheduleTitle")}
                  </span>
                  <p className="text-[0.9375rem] leading-relaxed">
                    {t("contactsPage.scheduleText")}
                  </p>
                </div>

                <div className="flex flex-col gap-1">
                  <span className="text-text-muted text-[0.8125rem] tracking-wide uppercase">
                    {t("contactsPage.languagesTitle")}
                  </span>
                  <p className="text-[0.9375rem]">{t("contactsPage.languagesText")}</p>
                </div>
              </div>
            </Reveal>
          </div>
        </section>

        <section className="mx-auto w-full max-w-7xl px-5 pb-16 lg:px-14 lg:pb-20">
          <Reveal from="up">
            <h2 className="mb-4 text-[1.5rem] font-bold tracking-[-0.03em] lg:text-3xl">
              {t("areas.title")}
            </h2>
            <ul className="flex flex-wrap gap-2">
              {areas.map((area) => (
                <li
                  key={area}
                  className="rounded-control border-border-strong inline-flex items-center gap-2 border px-3.5 py-2 text-[0.9375rem] font-semibold"
                >
                  <PinIcon className="text-info size-4 shrink-0" />
                  {area}
                </li>
              ))}
              <li className="rounded-control bg-action text-on-action inline-flex items-center px-3.5 py-2 text-[0.9375rem] font-bold">
                {t("areas.all")}
              </li>
            </ul>
            <p className="text-text-muted mt-3 text-[0.875rem] leading-relaxed">
              {t("areas.note")}
            </p>
          </Reveal>
        </section>
      </main>

      <SiteFooter />
      <MobileActionBar />
    </>
  );
}
