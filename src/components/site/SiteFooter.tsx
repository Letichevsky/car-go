import { useTranslations } from "next-intl";
import { LocaleSwitcher } from "@/components/site/LocaleSwitcher";
import { Link } from "@/i18n/navigation";
import { PhoneText } from "@/components/ui/PhoneText";
import { contacts } from "@/lib/contacts";

export function SiteFooter() {
  const t = useTranslations();
  const year = new Date().getFullYear();

  return (
    <footer className="border-border border-t">
      <div className="mx-auto flex w-full max-w-7xl flex-col gap-6 px-5 py-10 pb-28 lg:flex-row lg:items-start lg:justify-between lg:px-14 lg:pb-10">
        <div className="flex flex-col gap-2">
          <Link href="/" className="w-fit text-lg font-bold tracking-tight">
            CAR-<span className="text-action">GO!</span>
          </Link>
          <p className="text-text-muted max-w-[26rem] text-[0.9375rem]">{t("footer.tagline")}</p>
        </div>

        <div className="flex flex-col gap-2 text-[0.9375rem]">
          <a href={contacts.phoneHref} className="hover:text-info font-semibold">
            <PhoneText />
          </a>
          <a
            href={contacts.telegramHref}
            target="_blank"
            rel="noopener noreferrer"
            className="text-text-secondary hover:text-info"
          >
            {contacts.telegram}
          </a>
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
