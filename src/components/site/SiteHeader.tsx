import { useTranslations } from "next-intl";
import { LocaleSwitcher } from "@/components/site/LocaleSwitcher";
import { StickyHeader } from "@/components/site/StickyHeader";
import { Link } from "@/i18n/navigation";
import { ThemeToggle } from "@/components/site/ThemeToggle";
import { PhoneIcon } from "@/components/ui/icons";
import { PhoneText } from "@/components/ui/PhoneText";
import { contacts } from "@/lib/contacts";

export function SiteHeader() {
  const t = useTranslations();

  return (
    <StickyHeader>
      <header className="mx-auto flex w-full max-w-7xl items-center justify-between gap-4 px-5 py-4 lg:px-14">
        <Link href="/" className="flex items-center gap-3">
          {/* Место под знак из логотипа — ждём вектор от заказчика */}
          <span
            aria-hidden
            className="rounded-control border-border text-text-muted flex size-9 items-center justify-center border text-xs font-bold"
          >
            CG
          </span>
          <span className="text-xl font-bold tracking-tight">
            CAR-<span className="text-action">GO!</span>
          </span>
        </Link>

        <nav className="text-text-secondary hidden items-center gap-6 text-[0.9375rem] font-medium lg:flex">
          {[
            { href: "/#works", label: t("nav.works") },
            { href: "/#services", label: t("nav.services") },
            { href: "/#about", label: t("nav.about") },
            { href: "/#contacts", label: t("nav.contacts") },
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
          <LocaleSwitcher />
          <ThemeToggle />
          <a
            href={contacts.phoneHref}
            className="rounded-control border-border-strong hover:border-info hover:text-info hidden h-11 items-center gap-2 border px-4 text-sm leading-none font-semibold transition-colors duration-200 lg:inline-flex"
          >
            <PhoneIcon className="size-4 shrink-0" />
            <PhoneText />
          </a>
        </div>
      </header>
    </StickyHeader>
  );
}
