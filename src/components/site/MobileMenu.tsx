"use client";

import { useEffect, useRef, useState } from "react";
import { createPortal } from "react-dom";
import { useLocale, useTranslations } from "next-intl";
import { LocaleSwitcher } from "@/components/site/LocaleSwitcher";
import { ThemeToggle } from "@/components/site/ThemeToggle";
import { ChatIcon, PhoneIcon, PlusIcon } from "@/components/ui/icons";
import { PhoneText } from "@/components/ui/PhoneText";
import { Link } from "@/i18n/navigation";
import type { Locale } from "@/i18n/routing";
import { contactsPath } from "@/data/routes";
import { services, servicePath } from "@/data/services";
import { contacts } from "@/lib/contacts";
import { setMenuOpen } from "@/lib/menu";

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
  const [servicesOpen, setServicesOpen] = useState(false);
  const closeTimer = useRef<number | undefined>(undefined);

  const isOpen = state === "open";

  useEffect(() => {
    if (!isOpen) return;

    const onKey = (event: KeyboardEvent) => {
      if (event.key === "Escape") close();
    };

    document.addEventListener("keydown", onKey);
    return () => {
      document.removeEventListener("keydown", onKey);
      setMenuOpen(false);
    };
  }, [isOpen]);

  useEffect(() => () => window.clearTimeout(closeTimer.current), []);

  function open() {
    window.clearTimeout(closeTimer.current);
    setMenuOpen(true);
    setState("open");
  }

  /**
   * Прокрутку разблокируем прямо здесь, а не в очистке эффекта: состояние
   * применится только после обработчика, а переход по якорю случится внутри
   * него — при заблокированной странице прыжок к секции не сработает.
   */
  function close() {
    setMenuOpen(false);
    setState("closing");
    closeTimer.current = window.setTimeout(() => setState("closed"), CLOSE_MS);
  }

  const links = [
    { href: "/#areas", label: t("nav.areas") },
    { href: "/#works", label: t("nav.works") },
    { href: "/#why", label: t("nav.why") },
    { href: "/#how", label: t("nav.how") },
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
                {/*
                  «Услуги» на телефоне не ведут на секцию, а раскрывают список
                  направлений: с телефона удобнее попасть сразу на нужную страницу,
                  чем сначала прокручивать главную.
                */}
                <button
                  type="button"
                  onClick={() => setServicesOpen((value) => !value)}
                  aria-expanded={servicesOpen}
                  className="border-border hover:text-info flex cursor-pointer items-center justify-between gap-4 border-b py-4 text-lg font-semibold transition-colors duration-200"
                >
                  {t("nav.services")}
                  <PlusIcon
                    aria-hidden
                    className={`text-chevron size-5 shrink-0 transition-transform duration-300 ease-out ${
                      servicesOpen ? "rotate-45" : ""
                    }`}
                  />
                </button>

                {servicesOpen && (
                  <div className="border-border flex flex-col border-b py-1">
                    {services.map((service) => (
                      <Link
                        key={service.key}
                        href={servicePath(locale, service.key)}
                        onClick={close}
                        className="text-text-secondary hover:text-info py-2.5 pl-4 text-[0.9375rem] font-medium transition-colors duration-200"
                      >
                        {t(`services.${service.key}Title`)}
                      </Link>
                    ))}
                  </div>
                )}

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
