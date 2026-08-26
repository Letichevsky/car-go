import { useTranslations } from "next-intl";
import { LeadForm } from "@/components/site/LeadForm";
import { ChatIcon, CheckIcon, PhoneIcon } from "@/components/ui/icons";
import { Reveal } from "@/components/ui/Reveal";
import { contacts } from "@/lib/contacts";

/**
 * Первый экран без фонового фото: грузится текст, а не картинка.
 * Это лучший LCP из проверенных вариантов и заодно снимает зависимость
 * от разрешения снимков, которых у нас пока только 1280 px.
 */
export function Hero() {
  const t = useTranslations();

  return (
    <section
      id="top"
      data-analytics-zone="hero"
      className="mx-auto w-full max-w-7xl px-5 pt-8 pb-14 lg:px-14 lg:pt-16"
    >
      <div className="grid gap-10 lg:grid-cols-[1.25fr_0.75fr] lg:gap-16">
        <div className="flex flex-col gap-6">
          <Reveal immediate from="left">
            <p className="text-action flex items-center gap-3 text-xs font-bold tracking-[0.12em] uppercase">
              <span aria-hidden className="bg-action block h-0.5 w-6" />
              {t("hero.eyebrow")}
            </p>
          </Reveal>

          <Reveal immediate from="left" delay={90}>
            <h1 className="text-[2.25rem] leading-[1.1] font-bold tracking-[-0.035em] text-balance lg:text-[3.5rem]">
              {t("hero.title")}
            </h1>
          </Reveal>

          <Reveal immediate from="left" delay={180}>
            <p className="text-text-secondary max-w-[34rem] text-lg leading-relaxed">
              {t("hero.subtitle")}
            </p>
          </Reveal>

          <Reveal immediate from="up" delay={280}>
            <div className="flex max-w-[34rem] flex-col gap-4">
              <LeadForm buttonLabel={t("actions.getQuote")} />
              {/* Три пути к заявке рядом: форма, мессенджер и звонок */}
              <div className="flex flex-col gap-2.5 sm:flex-row">
                <a
                  href={contacts.whatsappHref}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="rounded-control border-border-strong hover:border-info hover:text-info inline-flex h-[3.25rem] items-center justify-center gap-2 border text-base font-semibold transition-colors duration-200 sm:flex-1"
                >
                  <ChatIcon className="size-[1.125rem]" />
                  {t("actions.whatsappShort")}
                </a>
                <a
                  href={contacts.phoneHref}
                  className="rounded-control border-border-strong hover:border-info hover:text-info inline-flex h-[3.25rem] items-center justify-center gap-2 border text-base font-semibold transition-colors duration-200 sm:flex-1"
                >
                  <PhoneIcon className="size-[1.125rem]" />
                  {t("actions.callNow")}
                </a>
              </div>
            </div>
          </Reveal>
        </div>

        <Reveal immediate from="right" delay={220}>
          <PriceCard />
        </Reveal>
      </div>
    </section>
  );
}

/** Карточка «что входит в цену» — прайс виден без прокрутки, это главное УТП. */
function PriceCard() {
  const t = useTranslations();

  const includes = [t("price.includeWork"), t("price.includeEquipment"), t("price.includeTeam")];

  // Цен на сайте нет: стоимость считается индивидуально, поэтому здесь только условия
  const rows = [
    { label: t("price.rowNoLift"), value: t("price.zero"), highlight: true },
    { label: t("price.rowWeekend"), value: t("price.zero"), highlight: true },
    { label: t("price.rowEstimate"), value: t("price.estimateFree"), highlight: false },
  ];

  return (
    <aside
      id="prices"
      className="rounded-card border-border bg-surface shadow-card flex flex-col gap-5 border p-6"
    >
      <h2 className="text-lg font-bold">{t("price.title")}</h2>

      <ul className="flex flex-col gap-3">
        {includes.map((item) => (
          <li key={item} className="flex items-start gap-3 text-[0.9375rem]">
            <CheckIcon className="text-info mt-0.5 size-[1.125rem] shrink-0" />
            <span>{item}</span>
          </li>
        ))}
      </ul>

      <div className="bg-border h-px" />

      <dl className="flex flex-col gap-3">
        {rows.map((row) => (
          <div key={row.label} className="flex items-baseline justify-between gap-4">
            <dt className="text-text-secondary text-[0.9375rem]">{row.label}</dt>
            <dd
              className={`text-base font-bold tabular-nums ${row.highlight ? "text-action" : ""}`}
            >
              {row.value}
            </dd>
          </div>
        ))}
      </dl>

      <p className="text-text-muted text-[0.8125rem] leading-relaxed">{t("price.note")}</p>
    </aside>
  );
}
