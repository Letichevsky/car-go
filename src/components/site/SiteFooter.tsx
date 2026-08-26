import { useLocale, useTranslations } from "next-intl";
import { LocaleSwitcher } from "@/components/site/LocaleSwitcher";
import { Link } from "@/i18n/navigation";
import { LogoMark } from "@/components/ui/LogoMark";
import { PhoneText } from "@/components/ui/PhoneText";
import { contactsPath } from "@/data/routes";
import { services, servicePath } from "@/data/services";
import type { Locale } from "@/i18n/routing";
import { contacts } from "@/lib/contacts";

export function SiteFooter() {
  const t = useTranslations();
  const locale = useLocale() as Locale;
  const year = new Date().getFullYear();

  return (
    <footer data-analytics-zone="footer" className="border-border border-t">
      <div className="mx-auto grid w-full max-w-7xl gap-8 px-5 py-10 pb-28 lg:grid-cols-[1.2fr_1fr_0.8fr_0.8fr] lg:gap-10 lg:px-14 lg:pb-10">
        <div className="flex flex-col gap-2">
          <Link href="/" aria-label="Car-Go!" className="flex w-fit items-center">
            <LogoMark className="h-16" />
          </Link>
          <p className="text-text-muted max-w-[26rem] text-[0.9375rem]">{t("footer.tagline")}</p>
        </div>

        {/* Ссылки на все услуги: и человеку удобнее, и поисковик видит структуру сайта */}
        <nav className="flex flex-col gap-2 text-[0.9375rem]">
          <span className="text-text-muted text-[0.8125rem] tracking-wide uppercase">
            {t("services.title")}
          </span>
          {services.map((service) => (
            <Link
              key={service.key}
              href={servicePath(locale, service.key)}
              className="text-text-secondary hover:text-info transition-colors duration-200"
            >
              {t(`services.${service.key}Title`)}
            </Link>
          ))}
        </nav>

        <div className="flex flex-col gap-2 text-[0.9375rem]">
          <span className="text-text-muted text-[0.8125rem] tracking-wide uppercase">
            {t("nav.contacts")}
          </span>
          <a href={contacts.phoneHref} className="hover:text-info font-semibold">
            <PhoneText />
          </a>
          <a
            href={contacts.whatsappHref}
            target="_blank"
            rel="noopener noreferrer"
            className="text-text-secondary hover:text-info transition-colors duration-200"
          >
            {t("actions.whatsappShort")}
          </a>
          <a
            href={contacts.telegramHref}
            target="_blank"
            rel="noopener noreferrer"
            className="text-text-secondary hover:text-info transition-colors duration-200"
          >
            {contacts.telegram}
          </a>
          <Link
            href={contactsPath(locale)}
            className="text-text-secondary hover:text-info transition-colors duration-200"
          >
            {t("contactsPage.title")}
          </Link>
        </div>

        <div className="flex flex-col gap-3">
          <span className="text-text-muted text-[0.8125rem] tracking-wide uppercase">
            {t("footer.language")}
          </span>
          <LocaleSwitcher />
          <p className="text-text-muted text-[0.8125rem]">
            © {year} Car-Go! {t("footer.rights")}
          </p>
        </div>
      </div>
    </footer>
  );
}
