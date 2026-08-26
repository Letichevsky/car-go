import { useTranslations } from "next-intl";
import { CheckIcon } from "@/components/ui/icons";
import { Reveal } from "@/components/ui/Reveal";

/** Восемь причин — конкретика вместо «мы профессионалы». */
export function WhyUs() {
  const t = useTranslations("why");
  const items = t.raw("items") as { title: string; text: string }[];

  return (
    <section
      id="why"
      data-analytics-zone="why"
      className="mx-auto w-full max-w-7xl px-5 py-14 lg:px-14 lg:py-16"
    >
      <Reveal from="up">
        <div className="mb-8 flex flex-col gap-2">
          <h2 className="text-[1.75rem] font-bold tracking-[-0.035em] lg:text-4xl">{t("title")}</h2>
          <p className="text-text-muted max-w-[38rem] text-[0.9375rem] leading-relaxed">
            {t("subtitle")}
          </p>
        </div>
      </Reveal>

      <ul className="grid gap-x-8 gap-y-6 sm:grid-cols-2 lg:grid-cols-4">
        {items.map((item, index) => (
          <Reveal key={item.title} from="up" delay={index * 60}>
            <li className="flex flex-col gap-2">
              <span className="flex items-start gap-2.5">
                <CheckIcon className="text-info mt-1 size-[1.125rem] shrink-0" />
                <span className="text-[1.0625rem] leading-snug font-bold">{item.title}</span>
              </span>
              <p className="text-text-muted pl-[1.625rem] text-[0.9375rem] leading-relaxed">
                {item.text}
              </p>
            </li>
          </Reveal>
        ))}
      </ul>
    </section>
  );
}
