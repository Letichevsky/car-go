import { useTranslations } from "next-intl";
import { CountUp } from "@/components/ui/CountUp";
import { Reveal } from "@/components/ui/Reveal";

/**
 * Полоса с крупными цифрами между первым экраном и работами.
 * Числа добегают до значения, когда полоса появляется на экране.
 *
 * «Больше 5000 переездов» — это оценка: пять лет работы, в среднем три выезда
 * в день без выходных, округлено вниз. Заказчику стоит подтвердить цифру,
 * прежде чем она уйдёт в прод (вопрос в §12 журнала).
 */
const stats = [
  { key: "years", value: 5, suffix: "+" },
  { key: "moves", value: 5000, suffix: "+" },
  { key: "extras", value: 0, suffix: " €", accent: true },
  { key: "languages", value: 4, suffix: "" },
] as const;

export function Stats() {
  const t = useTranslations("stats");

  return (
    <section className="border-border border-y">
      <div className="mx-auto grid w-full max-w-7xl grid-cols-2 lg:grid-cols-4">
        {stats.map((stat, index) => (
          <Reveal
            key={stat.key}
            from="up"
            delay={index * 90}
            className={`border-border px-5 py-7 lg:px-8 lg:py-9 ${
              index % 2 === 0 ? "border-r" : ""
            } ${index < 2 ? "border-b lg:border-b-0" : ""} lg:border-r lg:last:border-r-0`}
          >
            <div className="flex flex-col gap-2">
              <span
                className={`text-[2.25rem] leading-none font-bold tracking-[-0.04em] lg:text-[3rem] ${
                  stat.accent ? "text-action" : ""
                }`}
              >
                <CountUp to={stat.value} />
                {stat.suffix}
              </span>
              <span className="text-text-muted text-[0.9375rem] leading-snug">
                {t(`${stat.key}Label`)}
              </span>
            </div>
          </Reveal>
        ))}
      </div>
    </section>
  );
}
