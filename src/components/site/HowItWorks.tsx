import { useTranslations } from "next-intl";
import { Reveal } from "@/components/ui/Reveal";

/**
 * Шесть шагов переезда. Крупный номер и линия сверху — читается как маршрут,
 * а не как ещё один список преимуществ.
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

        <ol className="grid gap-x-8 gap-y-8 sm:grid-cols-2 lg:grid-cols-3">
          {steps.map((step, index) => (
            <Reveal key={step.title} from="up" delay={index * 70}>
              <li
                className={`flex flex-col gap-2 border-t-2 pt-4 ${
                  index === 0 ? "border-action" : "border-border-strong"
                }`}
              >
                <span className="text-text-muted text-sm font-bold tabular-nums">
                  {String(index + 1).padStart(2, "0")}
                </span>
                <h3 className="text-lg font-bold">{step.title}</h3>
                <p className="text-text-secondary text-[0.9375rem] leading-relaxed">{step.text}</p>
              </li>
            </Reveal>
          ))}
        </ol>
      </div>
    </section>
  );
}
