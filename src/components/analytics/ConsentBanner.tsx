"use client";

import { useTranslations } from "next-intl";
import { setConsent, useConsent } from "@/lib/consent";

/**
 * Баннер согласия. Появляется один раз, пока человек не ответил.
 *
 * Намеренно скромный: это не модальное окно на весь экран и оно не блокирует сайт —
 * отказ здесь равноценен согласию по количеству кликов, как того и требует GDPR.
 * Когда у заказчика появится страница политики конфиденциальности, сюда добавится
 * ссылка на неё; при желании баннер целиком заменяется сторонним CMP.
 */
export function ConsentBanner() {
  const t = useTranslations("consent");
  const state = useConsent();

  if (state !== "pending") return null;

  return (
    <div
      role="dialog"
      aria-label={t("title")}
      className="border-border bg-surface shadow-card rounded-card fixed inset-x-4 bottom-[calc(var(--action-bar-space)+1rem)] z-[60] flex flex-col gap-3 border p-4 sm:inset-x-auto sm:right-4 sm:max-w-[26rem]"
    >
      <p className="text-text-secondary text-[0.875rem] leading-relaxed">{t("text")}</p>
      <div className="flex gap-2">
        <button
          type="button"
          onClick={() => setConsent("granted")}
          className="rounded-control bg-action text-on-action hover:bg-action-hover h-11 flex-1 cursor-pointer px-4 text-[0.9375rem] font-bold transition-colors duration-200"
        >
          {t("accept")}
        </button>
        <button
          type="button"
          onClick={() => setConsent("denied")}
          className="rounded-control border-border-strong hover:border-info hover:text-info h-11 flex-1 cursor-pointer border px-4 text-[0.9375rem] font-semibold transition-colors duration-200"
        >
          {t("decline")}
        </button>
      </div>
    </div>
  );
}
