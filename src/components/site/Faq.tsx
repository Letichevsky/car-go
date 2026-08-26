import { useTranslations } from "next-intl";
import { PlusIcon } from "@/components/ui/icons";
import { Reveal } from "@/components/ui/Reveal";

/**
 * Частые вопросы на нативных <details> — ноль JS, содержимое всегда в разметке,
 * поисковик видит ответы целиком. Плюс на «плюсике» поворачивается в крестик
 * средствами CSS через состояние open.
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
        <h2 className="mb-7 text-[1.75rem] font-bold tracking-[-0.035em] lg:text-4xl">
          {t("title")}
        </h2>
      </Reveal>

      <div className="border-border border-t">
        {items.map((item, index) => (
          <Reveal key={item.q} from="up" delay={index * 50}>
            <details className="group border-border border-b">
              <summary className="flex cursor-pointer list-none items-start justify-between gap-6 py-5 text-[1.0625rem] font-bold [&::-webkit-details-marker]:hidden">
                {item.q}
                <PlusIcon className="text-chevron mt-0.5 size-5 shrink-0 transition-transform duration-300 ease-out group-open:rotate-45" />
              </summary>
              <p className="text-text-secondary max-w-[52rem] pb-5 leading-relaxed">{item.a}</p>
            </details>
          </Reveal>
        ))}
      </div>
    </section>
  );
}
