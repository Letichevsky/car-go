import { useTranslations } from "next-intl";
import { Reveal } from "@/components/ui/Reveal";

/**
 * Шесть шагов переезда. Раскладка повторяет страницы услуг: линейка сверху,
 * под ней номер, заголовок и текст. Под курсором линейка и номер вместе
 * загораются акцентом — видно, какой шаг сейчас читаешь.
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

        <ol className="grid gap-8 sm:grid-cols-2 lg:grid-cols-3 lg:gap-12">
          {steps.map((step, index) => (
            <Reveal key={step.title} from="up" delay={index * 70}>
              {/*
                Раскладка та же, что на страницах услуг: линейка, номер, заголовок,
                текст. Ниже lg наведения нет, и секция осталась бы полностью серой —
                поэтому там первый шаг подсвечен всегда.
              */}
              <li
                className={`group border-border-strong hover:border-action flex h-full flex-col gap-3 border-t-2 pt-5 transition-colors duration-300 ease-out ${
                  index === 0 ? "max-lg:border-action" : ""
                }`}
              >
                <span
                  className={`text-text-muted group-hover:text-action text-sm font-semibold tabular-nums transition-colors duration-300 ease-out ${
                    index === 0 ? "max-lg:text-action" : ""
                  }`}
                >
                  {String(index + 1).padStart(2, "0")}
                </span>

                <h3 className="text-xl font-bold">{step.title}</h3>
                <p className="text-text-secondary leading-relaxed">{step.text}</p>
              </li>
            </Reveal>
          ))}
        </ol>
      </div>
    </section>
  );
}
