import { useTranslations } from "next-intl";
import {
  ArrowRightIcon,
  BoxIcon,
  CartIcon,
  HomeIcon,
  OfficeIcon,
  ToolIcon,
} from "@/components/ui/icons";
import { Reveal } from "@/components/ui/Reveal";
import { Link } from "@/i18n/navigation";
import { services as serviceRoutes } from "@/data/services";
import { contacts } from "@/lib/contacts";

const services = [
  { key: "home", Icon: HomeIcon },
  { key: "office", Icon: OfficeIcon },
  { key: "delivery", Icon: CartIcon },
  { key: "loading", Icon: BoxIcon },
  { key: "assembly", Icon: ToolIcon },
] as const;

/**
 * Карточки — ссылки: пока ведут к форме просчёта, позже станут страницами услуг.
 * Поэтому у них курсор-указатель и подъём при наведении, одинаково плавный в обе стороны.
 */
export function Services() {
  const t = useTranslations();

  return (
    <section id="services" className="mx-auto w-full max-w-7xl px-5 py-14 lg:px-14 lg:py-16">
      <Reveal from="up">
        <div className="mb-7 flex flex-wrap items-end justify-between gap-4">
          <h2 className="text-[1.75rem] font-bold tracking-[-0.035em] lg:text-4xl">
            {t("services.title")}
          </h2>
          <a
            href="#contacts"
            className="text-info hover:text-info-hover inline-flex items-center gap-2 text-[0.9375rem] font-semibold transition duration-200"
          >
            {t("services.all")}
            <ArrowRightIcon className="size-[1.0625rem]" />
          </a>
        </div>
      </Reveal>

      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
        {services.map(({ key, Icon }, index) => (
          <Reveal key={key} from="up" delay={index * 80}>
            <Link
              href={`/services/${serviceRoutes.find((route) => route.key === key)!.slug}`}
              className="group border-border hover:border-info/60 hover:shadow-card rounded-card flex h-full cursor-pointer flex-col gap-3 border p-6 transition duration-300 ease-out hover:-translate-y-1.5"
            >
              <Icon className="text-info size-[1.625rem] transition duration-300 ease-out group-hover:scale-110" />
              <h3 className="text-lg font-bold">{t(`services.${key}Title`)}</h3>
              <p className="text-text-muted text-[0.9375rem] leading-relaxed">
                {t(`services.${key}Text`)}
              </p>
              <span className="text-info mt-auto inline-flex items-center gap-2 pt-2 text-[0.875rem] font-semibold">
                {t("services.more")}
                <ArrowRightIcon className="size-4 transition duration-300 ease-out group-hover:translate-x-1" />
              </span>
            </Link>
          </Reveal>
        ))}

        <Reveal from="up" delay={services.length * 80}>
          <a
            href={contacts.whatsappHref}
            target="_blank"
            rel="noopener noreferrer"
            className="group border-border bg-surface hover:border-action/60 hover:shadow-card rounded-card flex h-full cursor-pointer flex-col justify-between gap-3 border p-6 transition duration-300 ease-out hover:-translate-y-1.5"
          >
            <h3 className="text-lg leading-snug font-bold">{t("services.customTitle")}</h3>
            <p className="text-text-muted text-[0.9375rem] leading-relaxed">
              {t("services.customText")}
            </p>
            <span className="text-action inline-flex items-center gap-2 text-[0.9375rem] font-semibold">
              {t("services.customAction")}
              <ArrowRightIcon className="size-[1.0625rem] transition duration-300 ease-out group-hover:translate-x-1" />
            </span>
          </a>
        </Reveal>
      </div>
    </section>
  );
}
