import { useLocale, useTranslations } from "next-intl";
import {
  ArrowRightIcon,
  BoxIcon,
  CartIcon,
  HomeIcon,
  KeyIcon,
  MoversIcon,
  OfficeIcon,
  ToolsIcon,
  TruckIcon,
} from "@/components/ui/icons";
import { Reveal } from "@/components/ui/Reveal";
import { Link } from "@/i18n/navigation";
import type { Locale } from "@/i18n/routing";
import { services, servicePath, type ServiceKey } from "@/data/services";
import { contactsPath } from "@/data/routes";

const icons: Record<ServiceKey, typeof HomeIcon> = {
  home: HomeIcon,
  turnkey: KeyIcon,
  office: OfficeIcon,
  packing: BoxIcon,
  assembly: ToolsIcon,
  equipment: TruckIcon,
  delivery: CartIcon,
  loading: MoversIcon,
};

/**
 * Восемь направлений — восемь одинаковых карточек.
 *
 * Раньше две услуги стояли строкой под сеткой и читались как второсортные,
 * хотя это такие же услуги. Карточка горизонтальная: слева плитка с иконкой,
 * справа текст — так восемь штук помещаются в две колонки и не превращаются
 * в узкие столбики с переносами на каждом слове.
 */
export function Services() {
  const t = useTranslations();
  const locale = useLocale() as Locale;

  return (
    <section
      id="services"
      data-analytics-zone="services"
      className="mx-auto w-full max-w-7xl px-5 py-14 lg:px-14 lg:py-16"
    >
      <Reveal from="up">
        <div className="mb-8 flex flex-wrap items-end justify-between gap-4">
          <div className="flex flex-col gap-2">
            <h2 className="text-[1.75rem] font-bold tracking-[-0.035em] lg:text-4xl">
              {t("services.title")}
            </h2>
            <p className="text-text-muted max-w-[38rem] text-[0.9375rem] leading-relaxed">
              {t("services.subtitle")}
            </p>
          </div>
          <Link
            href={contactsPath(locale)}
            className="text-info hover:text-info-hover inline-flex items-center gap-2 text-[0.9375rem] font-semibold transition duration-200"
          >
            {t("services.all")}
            <ArrowRightIcon className="size-[1.0625rem]" />
          </Link>
        </div>
      </Reveal>

      <div className="grid gap-4 lg:grid-cols-2">
        {services.map((service, index) => {
          const Icon = icons[service.key];
          return (
            <Reveal key={service.key} from="up" delay={index * 50}>
              <Link
                href={servicePath(locale, service.key)}
                className="group border-border hover:border-info/60 hover:shadow-card rounded-card flex h-full cursor-pointer overflow-hidden border transition duration-300 ease-out hover:-translate-y-1.5"
              >
                {/* Зона иконки во всю высоту карточки, ширина одна на все карточки */}
                <span className="bg-surface border-border flex w-20 shrink-0 items-center justify-center border-r sm:w-24">
                  <Icon className="text-info size-8 transition duration-300 ease-out group-hover:scale-110" />
                </span>

                <span className="flex flex-1 flex-col gap-2 p-5 sm:p-6">
                  <span className="text-lg font-bold">{t(`services.${service.key}Title`)}</span>
                  <span className="text-text-muted text-[0.9375rem] leading-relaxed">
                    {t(`services.${service.key}Text`)}
                  </span>
                  <span className="text-info mt-auto inline-flex items-center gap-2 pt-2 text-[0.875rem] font-semibold">
                    {t("services.more")}
                    <ArrowRightIcon className="size-4 transition duration-300 ease-out group-hover:translate-x-1" />
                  </span>
                </span>
              </Link>
            </Reveal>
          );
        })}
      </div>
    </section>
  );
}
