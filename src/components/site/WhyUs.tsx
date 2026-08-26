import { useTranslations } from "next-intl";
import {
  AwardIcon,
  BoxIcon,
  CheckIcon,
  PinIcon,
  RouteIcon,
  TagIcon,
  TruckIcon,
  UsersIcon,
  WeightIcon,
} from "@/components/ui/icons";
import { Reveal } from "@/components/ui/Reveal";

/**
 * Восемь причин.
 *
 * Порядок иконок совпадает с порядком `why.items` в переводах — если менять
 * список, менять надо оба места. Последний пункт про отсутствие доплат выделен:
 * это самая сильная выгода из всех, и в плоском списке она терялась.
 */
const icons = [AwardIcon, BoxIcon, TruckIcon, WeightIcon, UsersIcon, PinIcon, RouteIcon, TagIcon];
const ACCENT = icons.length - 1;

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

      <ul className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
        {items.map((item, index) => {
          const Icon = icons[index] ?? CheckIcon;
          const accent = index === ACCENT;

          return (
            <Reveal key={item.title} from="up" delay={index * 50}>
              <li
                className={`rounded-card flex h-full flex-col gap-3 border p-5 ${
                  accent ? "border-action/40 bg-action/5" : "border-border"
                }`}
              >
                <span
                  className={`rounded-control flex size-11 items-center justify-center ${
                    accent ? "bg-action text-on-action" : "bg-surface-strong text-info"
                  }`}
                >
                  <Icon className="size-[1.375rem]" />
                </span>
                <h3 className="text-[1.0625rem] leading-snug font-bold">{item.title}</h3>
                <p className="text-text-muted text-[0.9375rem] leading-relaxed">{item.text}</p>
              </li>
            </Reveal>
          );
        })}
      </ul>
    </section>
  );
}
