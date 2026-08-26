"use client";

import { useEffect, useState } from "react";
import { useTranslations } from "next-intl";
import { ChatIcon, PhoneIcon } from "@/components/ui/icons";
import { contacts } from "@/lib/contacts";

/**
 * Липкая панель на телефоне: WhatsApp, звонок и главное действие под большим пальцем.
 *
 * На первом экране она не показывается: там уже есть красная кнопка в форме,
 * и две красные кнопки сразу — перебор. Панель выезжает, когда до секции услуг
 * долистали, и уезжает обратно, если вернуться выше неё.
 *
 * Секцию передаёт страница: без неё панель видна сразу — так на страницах услуг,
 * работ и контактов ничего не меняется.
 */
export function MobileActionBar({ revealFrom }: { revealFrom?: string }) {
  const t = useTranslations();
  const [visible, setVisible] = useState(!revealFrom);

  useEffect(() => {
    const anchor = revealFrom ? document.getElementById(revealFrom) : null;
    if (!anchor) return;

    let frame = 0;

    const check = () => {
      frame = 0;
      // верхний край секции вошёл в экран или уже выше него
      setVisible(anchor.getBoundingClientRect().top < window.innerHeight);
    };

    const onScroll = () => {
      if (!frame) frame = window.requestAnimationFrame(check);
    };

    check();
    window.addEventListener("scroll", onScroll, { passive: true });
    window.addEventListener("resize", onScroll, { passive: true });

    return () => {
      window.removeEventListener("scroll", onScroll);
      window.removeEventListener("resize", onScroll);
      window.cancelAnimationFrame(frame);
    };
  }, [revealFrom]);

  // Баннер согласия и кнопка «наверх» встают над панелью, поэтому им нужно знать,
  // выехала она или нет. Отметку читает CSS через --action-bar-space.
  useEffect(() => {
    const root = document.documentElement;
    if (visible) root.dataset.actionbar = "on";
    else delete root.dataset.actionbar;

    return () => {
      delete root.dataset.actionbar;
    };
  }, [visible]);

  return (
    <div
      data-analytics-zone="mobile-bar"
      aria-hidden={!visible}
      className={`mobile-action-bar border-border bg-bg/95 fixed inset-x-0 bottom-0 z-50 border-t backdrop-blur transition-transform duration-300 ease-out lg:hidden ${
        visible ? "translate-y-0" : "pointer-events-none translate-y-full"
      }`}
    >
      <div
        className="grid grid-cols-[3.25rem_3.25rem_1fr] gap-2.5 px-5 py-3"
        style={{ paddingBottom: "calc(0.75rem + env(safe-area-inset-bottom))" }}
      >
        <a
          href={contacts.phoneHref}
          tabIndex={visible ? 0 : -1}
          aria-label={t("actions.callNow")}
          className="rounded-control border-border-strong text-info flex h-[3.25rem] items-center justify-center border"
        >
          <PhoneIcon className="size-[1.375rem]" />
        </a>
        <a
          href={contacts.whatsappHref}
          target="_blank"
          rel="noopener noreferrer"
          tabIndex={visible ? 0 : -1}
          aria-label={t("actions.whatsappShort")}
          className="rounded-control border-border-strong text-info flex h-[3.25rem] items-center justify-center border"
        >
          <ChatIcon className="size-[1.375rem]" />
        </a>
        <a
          href="#contacts"
          tabIndex={visible ? 0 : -1}
          className="rounded-control bg-action text-on-action flex h-[3.25rem] items-center justify-center text-base font-bold"
        >
          {t("actions.estimate")}
        </a>
      </div>
    </div>
  );
}
