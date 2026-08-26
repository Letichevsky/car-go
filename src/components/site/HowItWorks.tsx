import { useTranslations } from "next-intl";
import { Reveal } from "@/components/ui/Reveal";

/**
 * Шесть шагов переезда. Раскладка повторяет страницы услуг: линейка сверху,
 * под ней номер, заголовок и текст.
 *
 * Подсветка описана в globals.css: по умолчанию горит первый шаг, под курсором —
 * тот, на который навели. `Reveal` лежит внутри `li`, а не снаружи: внутри `ol`
 * могут быть только `li`, да и переход цвета не пережил бы инлайновый transition
 * появления.
 */
export function HowItWorks() {
  const t = useTranslations("how");
  const steps = t.raw("steps") as { title: string; text: string }[];

  return (
    <section id="how" data-analytics-zone="how" className="bg-surface border-border border-y">
      <div className="mx-auto w-full max-w-7xl px-5 py-14 lg:px-14 lg:py-16">
        <Reveal from="up">
          <div className="mb-8 flex flex-col gap-2">
            <h2 className="text-[1.75rem] font-bold tracking-[-0.035em] lg:text-4xl">
              {t("title")}
            </h2>
            <p className="text-text-muted max-w-[38rem] text-[0.9375rem] leading-relaxed">
              {t("subtitle")}
            </p>
          </div>
        </Reveal>

        <ol className="steps grid gap-8 sm:grid-cols-2 lg:grid-cols-3 lg:gap-12">
          {steps.map((step, index) => (
            <li
              key={step.title}
              className="border-border-strong h-full border-t-2 pt-5 transition-colors duration-300 ease-out"
            >
              <Reveal from="up" delay={index * 70} className="flex flex-col gap-3">
                <span className="steps-number text-text-muted text-sm font-semibold tabular-nums transition-colors duration-300 ease-out">
                  {String(index + 1).padStart(2, "0")}
                </span>
                <h3 className="text-xl font-bold">{step.title}</h3>
                <p className="text-text-secondary leading-relaxed">{step.text}</p>
              </Reveal>
            </li>
          ))}
        </ol>
      </div>
    </section>
  );
}
