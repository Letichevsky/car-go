import { useLocale, useTranslations } from "next-intl";
import {
  ArrowRightIcon,
  BoxIcon,
  HomeIcon,
  KeyIcon,
  OfficeIcon,
  ToolIcon,
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
  assembly: ToolIcon,
  equipment: TruckIcon,
  delivery: BoxIcon,
  loading: TruckIcon,
};

/**
 * Шесть основных направлений карточками, остальные — строкой ниже.
 * Полотном на главной услуги не расписываем: подробности живут на своих страницах.
 */
export function Services() {
  const t = useTranslations();
  const locale = useLocale() as Locale;

  const primary = services.filter((service) => service.primary);
  const secondary = services.filter((service) => !service.primary);

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

      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
        {primary.map((service, index) => {
          const Icon = icons[service.key];
          return (
            <Reveal key={service.key} from="up" delay={index * 70}>
              <Link
                href={servicePath(locale, service.key)}
                className="group border-border hover:border-info/60 hover:shadow-card rounded-card flex h-full cursor-pointer flex-col gap-3 border p-6 transition duration-300 ease-out hover:-translate-y-1.5"
              >
                <Icon className="text-info size-[1.625rem] transition duration-300 ease-out group-hover:scale-110" />
                <h3 className="text-lg font-bold">{t(`services.${service.key}Title`)}</h3>
                <p className="text-text-muted text-[0.9375rem] leading-relaxed">
                  {t(`services.${service.key}Text`)}
                </p>
                <span className="text-info mt-auto inline-flex items-center gap-2 pt-2 text-[0.875rem] font-semibold">
                  {t("services.more")}
                  <ArrowRightIcon className="size-4 transition duration-300 ease-out group-hover:translate-x-1" />
                </span>
              </Link>
            </Reveal>
          );
        })}
      </div>

      {/* Остальные услуги — строкой: важны, но на главной не должны спорить с шестью основными */}
      <Reveal from="up" delay={primary.length * 70}>
        <div className="mt-6 flex flex-wrap items-center gap-x-3 gap-y-2">
          <span className="text-text-muted text-[0.9375rem] font-semibold">
            {t("services.secondaryTitle")}
          </span>
          {secondary.map((service) => (
            <Link
              key={service.key}
              href={servicePath(locale, service.key)}
              className="rounded-control border-border-strong hover:border-info hover:text-info inline-flex items-center gap-2 border px-3.5 py-2 text-[0.9375rem] font-semibold transition-colors duration-200"
            >
              {t(`services.${service.key}Title`)}
              <ArrowRightIcon className="size-4" />
            </Link>
          ))}
        </div>
      </Reveal>
    </section>
  );
}
