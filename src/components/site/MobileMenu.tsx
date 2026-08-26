"use client";

import { useEffect, useState } from "react";
import { createPortal } from "react-dom";
import { useLocale, useTranslations } from "next-intl";
import { LocaleSwitcher } from "@/components/site/LocaleSwitcher";
import { ThemeToggle } from "@/components/site/ThemeToggle";
import { ChatIcon, CloseIcon, MenuIcon, PhoneIcon } from "@/components/ui/icons";
import { PhoneText } from "@/components/ui/PhoneText";
import { Link } from "@/i18n/navigation";
import type { Locale } from "@/i18n/routing";
import { contactsPath } from "@/data/routes";
import { contacts } from "@/lib/contacts";

/**
 * Меню для телефона. В шапке на узком экране не помещается ничего, кроме знака,
 * поэтому пункты, выбор языка и переключатель темы уезжают сюда.
 *
 * Панель рисуется порталом в body: у шапки есть backdrop-filter, а он создаёт
 * содержащий блок — position: fixed внутри неё считался бы от самой шапки,
 * и панель не заняла бы весь экран. Плюс шапка ещё и уезжает вверх при прокрутке.
 */
export function MobileMenu() {
  const t = useTranslations();
  const locale = useLocale() as Locale;
  const [open, setOpen] = useState(false);

  useEffect(() => {
    if (!open) return;

    const onKey = (event: KeyboardEvent) => {
      if (event.key === "Escape") close();
    };

    document.addEventListener("keydown", onKey);
    const previousOverflow = document.body.style.overflow;
    document.body.style.overflow = "hidden";

    return () => {
      document.removeEventListener("keydown", onKey);
      document.body.style.overflow = previousOverflow;
    };
  }, [open]);

  /**
   * Закрытие. Прокрутку разблокируем прямо здесь, а не в очистке эффекта:
   * состояние применится только после обработчика, а переход по якорю случится
   * внутри него — при заблокированном body прыжок к секции просто не сработает.
   */
  function close() {
    document.body.style.overflow = "";
    setOpen(false);
  }

  const links = [
    { href: "/#services", label: t("nav.services") },
    { href: "/#how", label: t("nav.how") },
    { href: "/#works", label: t("nav.works") },
    { href: "/#why", label: t("nav.why") },
    { href: "/#areas", label: t("nav.areas") },
    { href: "/#faq", label: t("nav.faq") },
    { href: contactsPath(locale), label: t("nav.contacts") },
  ];

  return (
    <>
      <button
        type="button"
        onClick={() => setOpen(true)}
        aria-label={t("nav.menu")}
        aria-expanded={open}
        className="rounded-control border-border text-text-secondary flex size-11 cursor-pointer items-center justify-center border transition-colors duration-200 lg:hidden"
      >
        <MenuIcon className="size-5" />
      </button>

      {open &&
        createPortal(
          <div
            role="dialog"
            aria-modal="true"
            aria-label={t("nav.menu")}
            data-analytics-zone="mobile-menu"
            className="fixed inset-0 z-[70] lg:hidden"
          >
            <div className="absolute inset-0 bg-black/50 backdrop-blur-sm" onClick={close} />

            <div className="bg-bg absolute inset-y-0 right-0 flex w-[86%] max-w-sm flex-col gap-6 overflow-y-auto p-5">
              <div className="flex items-center justify-between gap-4">
                <span className="text-xl font-bold tracking-tight">
                  CAR-<span className="text-action">GO!</span>
                </span>
                <button
                  type="button"
                  onClick={close}
                  aria-label={t("gallery.close")}
                  className="rounded-control border-border text-text-secondary flex size-11 cursor-pointer items-center justify-center border"
                >
                  <CloseIcon className="size-5" />
                </button>
              </div>

              <nav className="flex flex-col">
                {links.map((link) => (
                  <Link
                    key={link.href}
                    href={link.href}
                    onClick={close}
                    className="border-border hover:text-info border-b py-4 text-lg font-semibold transition-colors duration-200"
                  >
                    {link.label}
                  </Link>
                ))}
              </nav>

              <div className="flex items-center justify-between gap-4">
                <LocaleSwitcher className="text-base" />
                <ThemeToggle />
              </div>

              <div className="mt-auto flex flex-col gap-2.5">
                <a
                  href={contacts.phoneHref}
                  className="rounded-control border-border-strong flex h-[3.25rem] items-center justify-center gap-2 border text-base font-semibold"
                >
                  <PhoneIcon className="size-[1.125rem]" />
                  <PhoneText />
                </a>
                <a
                  href={contacts.whatsappHref}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="rounded-control bg-action text-on-action flex h-[3.25rem] items-center justify-center gap-2 text-base font-bold"
                >
                  <ChatIcon className="size-[1.125rem]" />
                  {t("actions.whatsappShort")}
                </a>
              </div>
            </div>
          </div>,
          document.body,
        )}
    </>
  );
}
