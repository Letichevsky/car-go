import { useTranslations } from "next-intl";
import { PinIcon } from "@/components/ui/icons";
import { Reveal } from "@/components/ui/Reveal";
import { areas } from "@/data/areas";

/**
 * География. Отдельным блоком, потому что локальный поиск («mudanças Leiria»)
 * — половина трафика такого бизнеса, и города должны быть текстом на странице.
 */
export function Areas() {
  const t = useTranslations("areas");

  return (
    <section id="areas" data-analytics-zone="areas" className="bg-surface border-border border-y">
      <div className="mx-auto grid w-full max-w-7xl gap-8 px-5 py-14 lg:grid-cols-[0.8fr_1.2fr] lg:gap-14 lg:px-14 lg:py-16">
        <Reveal from="left">
          <div className="flex flex-col gap-2">
            <h2 className="text-[1.75rem] font-bold tracking-[-0.035em] lg:text-4xl">
              {t("title")}
            </h2>
            <p className="text-text-muted text-[0.9375rem] leading-relaxed">{t("subtitle")}</p>
          </div>
        </Reveal>

        <Reveal from="right" delay={100}>
          <div className="flex flex-col gap-4">
            <ul className="flex flex-wrap gap-2">
              {areas.map((area) => (
                <li
                  key={area}
                  className="rounded-control border-border-strong bg-bg inline-flex items-center gap-2 border px-3.5 py-2 text-[0.9375rem] font-semibold"
                >
                  <PinIcon className="text-info size-4 shrink-0" />
                  {area}
                </li>
              ))}
              <li className="rounded-control bg-action text-on-action inline-flex items-center px-3.5 py-2 text-[0.9375rem] font-bold">
                {t("all")}
              </li>
            </ul>
            <p className="text-text-muted text-[0.875rem] leading-relaxed">{t("note")}</p>
          </div>
        </Reveal>
      </div>
    </section>
  );
}
