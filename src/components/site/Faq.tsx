import { useTranslations } from "next-intl";
import { PlusIcon } from "@/components/ui/icons";
import { Reveal } from "@/components/ui/Reveal";

/**
 * Частые вопросы на нативных <details> — ноль JS, содержимое всегда в разметке,
 * поисковик видит ответы целиком.
 *
 * Атрибут `name` делает из них настоящую гармошку: открытие одного закрывает
 * остальные. Браузеры без поддержки просто откроют несколько сразу — не поломка.
 * Ответ появляется анимацией: у закрытого <details> содержимое не отрисовано,
 * поэтому переходом высоту не оживить, а вот появление — можно.
 */
export function Faq() {
  const t = useTranslations("faq");
  const items = t.raw("items") as { q: string; a: string }[];

  return (
    <section
      id="faq"
      data-analytics-zone="faq"
      className="mx-auto w-full max-w-7xl px-5 py-14 lg:px-14 lg:py-16"
    >
      <Reveal from="up">
        <h2 className="mb-8 text-[1.75rem] font-bold tracking-[-0.035em] lg:text-4xl">
          {t("title")}
        </h2>
      </Reveal>

      <div className="grid items-start gap-3 md:grid-cols-2">
        {items.map((item, index) => (
          <Reveal key={item.q} from="up" delay={index * 40}>
            <details
              name="faq"
              className="group border-border bg-bg rounded-card open:border-info/50 open:shadow-card border transition-colors duration-200"
            >
              <summary className="group-hover:text-info flex cursor-pointer list-none items-center justify-between gap-5 p-5 text-[1.0625rem] leading-snug font-bold transition-colors duration-200 [&::-webkit-details-marker]:hidden">
                {item.q}
                {/* Квадрат стоит на месте, внутри поворачивается плюс — и всё */}
                <span className="rounded-control border-border-strong flex size-8 shrink-0 items-center justify-center border">
                  <PlusIcon className="text-chevron size-4 transition-transform duration-300 ease-out group-open:rotate-45" />
                </span>
              </summary>

              <p className="faq-answer text-text-secondary px-5 pb-5 leading-relaxed">{item.a}</p>
            </details>
          </Reveal>
        ))}
      </div>
    </section>
  );
}
