import { useTranslations } from "next-intl";
import { CountUp } from "@/components/ui/CountUp";
import { Reveal } from "@/components/ui/Reveal";

/**
 * Полоса с крупными цифрами между первым экраном и работами.
 * Числа добегают до значения, когда полоса появляется на экране.
 *
 * Счётчик доплат идёт в обратную сторону — от десяти тысяч к нулю: так «0 €»
 * читается не как пустое место, а как обещание.
 *
 * Цифры по переездам и клиентам — оценка со слов заказчика, их нужно
 * подтвердить перед запуском (вопрос в §12 журнала).
 */
const stats = [
  { key: "years", value: 5, from: 0, suffix: "+" },
  { key: "moves", value: 3000, from: 0, suffix: "+" },
  { key: "extras", value: 0, from: 10000, suffix: " €", accent: true },
  { key: "clients", value: 400, from: 0, suffix: "+" },
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
                className={`text-[2rem] leading-none font-bold tracking-[-0.04em] whitespace-nowrap sm:text-[2.25rem] lg:text-[3rem] ${
                  stat.accent ? "text-action" : ""
                }`}
              >
                <CountUp to={stat.value} from={stat.from} />
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
