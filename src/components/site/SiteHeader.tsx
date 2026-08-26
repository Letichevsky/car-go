import { useLocale, useTranslations } from "next-intl";
import { LocaleSwitcher } from "@/components/site/LocaleSwitcher";
import { MobileMenu } from "@/components/site/MobileMenu";
import { StickyHeader } from "@/components/site/StickyHeader";
import { Link } from "@/i18n/navigation";
import { ThemeToggle } from "@/components/site/ThemeToggle";
import { PhoneIcon } from "@/components/ui/icons";
import { PhoneText } from "@/components/ui/PhoneText";
import { contactsPath } from "@/data/routes";
import type { Locale } from "@/i18n/routing";
import { contacts } from "@/lib/contacts";
import brand from "@/data/brand.json";

export function SiteHeader() {
  const t = useTranslations();
  const locale = useLocale() as Locale;

  return (
    <StickyHeader>
      <header
        data-analytics-zone="header"
        className="mx-auto flex w-full max-w-7xl items-center justify-between gap-4 px-5 py-3 lg:px-14"
      >
        {/*
          ВРЕМЕННО (2026-08-26): знак из присланного логотипа вместо монограммы «CG»
          и надписи CAR-GO!. Чтобы вернуть прежний вариант, достаточно заменить обе
          картинки на два span — см. журнал §10.
        */}
        <Link href="/" aria-label="Car-Go!" className="flex items-center">
          <picture>
            <img
              src="/brand/logo-light.png"
              alt=""
              width={brand.logo.width}
              height={brand.logo.height}
              className="logo-mark--light h-13 w-auto"
            />
          </picture>
          <picture>
            <img
              src="/brand/logo-dark.png"
              alt=""
              width={brand.logo.width}
              height={brand.logo.height}
              className="logo-mark--dark h-13 w-auto"
            />
          </picture>
        </Link>

        <nav className="text-text-secondary hidden items-center gap-6 text-[0.9375rem] font-medium lg:flex">
          {[
            { href: "/#services", label: t("nav.services") },
            { href: "/#how", label: t("nav.how") },
            { href: "/#works", label: t("nav.works") },
            { href: "/#faq", label: t("nav.faq") },
            { href: contactsPath(locale), label: t("nav.contacts") },
          ].map((link) => (
            <Link
              key={link.href}
              href={link.href}
              className="hover:text-text transition-colors duration-200"
            >
              {link.label}
            </Link>
          ))}
        </nav>

        <div className="flex items-center gap-3">
          {/* На телефоне язык, тема и меню живут в панели за бургером */}
          <div className="hidden items-center gap-3 lg:flex">
            <LocaleSwitcher />
            <ThemeToggle />
            <a
              href={contacts.phoneHref}
              className="rounded-control border-border-strong hover:border-info hover:text-info inline-flex h-11 items-center gap-2 border px-4 text-sm leading-none font-semibold transition-colors duration-200"
            >
              <PhoneIcon className="size-4 shrink-0" />
              <PhoneText />
            </a>
          </div>
          <MobileMenu />
        </div>
      </header>
    </StickyHeader>
  );
}
