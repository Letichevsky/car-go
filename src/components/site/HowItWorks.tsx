import { useTranslations } from "next-intl";
import { Reveal } from "@/components/ui/Reveal";

/**
 * Шесть шагов переезда.
 *
 * Крупный номер уходит в фон карточки: последовательность считывается сразу,
 * а подписи не спорят с ним за внимание. Раньше шаги были просто колонками
 * текста под тонкой линейкой и читались как ещё один список.
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

        <ol className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {steps.map((step, index) => (
            <Reveal key={step.title} from="up" delay={index * 60}>
              <li className="border-border bg-bg rounded-card relative h-full overflow-hidden border p-6">
                <span
                  aria-hidden
                  className="text-action/12 pointer-events-none absolute -top-4 right-4 text-[5.5rem] leading-none font-bold tabular-nums select-none"
                >
                  {index + 1}
                </span>

                <div className="relative flex flex-col gap-2">
                  <h3 className="text-lg font-bold">{step.title}</h3>
                  <p className="text-text-secondary text-[0.9375rem] leading-relaxed">
                    {step.text}
                  </p>
                </div>
              </li>
            </Reveal>
          ))}
        </ol>
      </div>
    </section>
  );
}
