import { useTranslations } from "next-intl";
import { Reveal } from "@/components/ui/Reveal";

/**
 * Шесть шагов переезда. Колонка под линейкой, номер — крупной цифрой слева
 * от заголовка. Под курсором линейка и цифра вместе загораются акцентом:
 * так видно, какой шаг сейчас читаешь.
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
              {/*
                Ниже lg наведения нет, и секция осталась бы полностью серой —
                поэтому там первый шаг подсвечен всегда. С lg подсветка целиком
                отдана курсору.
              */}
              <li
                className={`group border-border-strong hover:border-action flex h-full gap-4 border-t-2 pt-4 transition-colors duration-300 ease-out ${
                  index === 0 ? "max-lg:border-action" : ""
                }`}
              >
                <span
                  aria-hidden
                  className={`text-border-strong group-hover:text-action shrink-0 text-[2.5rem] leading-[0.85] font-bold tabular-nums transition-colors duration-300 ease-out select-none ${
                    index === 0 ? "max-lg:text-action" : ""
                  }`}
                >
                  {index + 1}
                </span>

                <div className="flex flex-col gap-2">
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
