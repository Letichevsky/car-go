"use client";

import { useEffect, useRef, useState } from "react";
import { createPortal } from "react-dom";
import { useLocale, useTranslations } from "next-intl";
import { LocaleSwitcher } from "@/components/site/LocaleSwitcher";
import { ThemeToggle } from "@/components/site/ThemeToggle";
import { ChatIcon, PhoneIcon } from "@/components/ui/icons";
import { PhoneText } from "@/components/ui/PhoneText";
import { Link } from "@/i18n/navigation";
import type { Locale } from "@/i18n/routing";
import { contactsPath } from "@/data/routes";
import { contacts } from "@/lib/contacts";

/** Столько длится выезд панели — столько же держим её в разметке при закрытии */
const CLOSE_MS = 240;

type State = "closed" | "open" | "closing";

/**
 * Меню для телефона.
 *
 * Кнопка никуда не двигается: она живёт в шапке и на месте превращается из
 * бургера в крестик. Панель выезжает из-за правого края **под** шапкой —
 * поэтому она и затемнение начинаются от нижней кромки шапки и её не перекрывают.
 *
 * Панель рисуется порталом в body: у шапки backdrop-filter, а он создаёт
 * содержащий блок, и position: fixed внутри считался бы от самой шапки.
 */
export function MobileMenu() {
  const t = useTranslations();
  const locale = useLocale() as Locale;
  const [state, setState] = useState<State>("closed");
  const closeTimer = useRef<number | undefined>(undefined);

  const isOpen = state === "open";

  useEffect(() => {
    if (!isOpen) return;

    const onKey = (event: KeyboardEvent) => {
      if (event.key === "Escape") close();
    };

    document.addEventListener("keydown", onKey);
    document.body.style.overflow = "hidden";

    return () => {
      document.removeEventListener("keydown", onKey);
      document.body.style.overflow = "";
    };
  }, [isOpen]);

  useEffect(() => () => window.clearTimeout(closeTimer.current), []);

  function open() {
    window.clearTimeout(closeTimer.current);
    setState("open");
  }

  /**
   * Прокрутку разблокируем прямо здесь, а не в очистке эффекта: состояние
   * применится только после обработчика, а переход по якорю случится внутри
   * него — при заблокированном body прыжок к секции не сработает.
   */
  function close() {
    document.body.style.overflow = "";
    setState("closing");
    closeTimer.current = window.setTimeout(() => setState("closed"), CLOSE_MS);
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
        onClick={isOpen ? close : open}
        aria-label={t("nav.menu")}
        aria-expanded={isOpen}
        className="rounded-control border-border text-text-secondary relative z-10 flex size-11 cursor-pointer items-center justify-center border transition-colors duration-200 lg:hidden"
      >
        <span aria-hidden className="burger" data-open={isOpen}>
          <span />
          <span />
          <span />
        </span>
      </button>

      {state !== "closed" &&
        createPortal(
          <div
            data-analytics-zone="mobile-menu"
            className="fixed inset-x-0 bottom-0 z-[70] lg:hidden"
            style={{ top: "var(--header-height)" }}
          >
            <div
              data-state={state}
              onClick={close}
              className="menu-scrim absolute inset-0 bg-black/50 backdrop-blur-sm"
            />

            <nav
              aria-label={t("nav.menu")}
              data-state={state}
              className="menu-panel bg-bg absolute inset-y-0 right-0 flex w-[86%] max-w-sm flex-col gap-6 overflow-y-auto p-5"
            >
              <div className="flex flex-col">
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
              </div>

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
            </nav>
          </div>,
          document.body,
        )}
    </>
  );
}
