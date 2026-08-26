"use client";

import { useSyncExternalStore } from "react";
import { pushEvent } from "@/lib/analytics";

/**
 * Согласие на аналитические и рекламные куки (Consent Mode v2).
 *
 * Португалия — ЕС, поэтому GA4 и Google Ads до ответа человека работают в режиме
 * «запрещено»: Google получает обезличенные сигналы, куки не ставятся. Выбор
 * хранится в localStorage и применяется инлайн-скриптом ещё до загрузки GTM,
 * чтобы на повторных визитах не было мигания «запрещено → разрешено».
 */
export const CONSENT_KEY = "cargo-consent";

export type ConsentState = "granted" | "denied";
/** `pending` — человек ещё не отвечал, `unknown` — рендер на сервере */
export type ConsentSnapshot = ConsentState | "pending" | "unknown";

const CHANGE_EVENT = "cargo-consent-change";

function subscribe(onChange: () => void) {
  window.addEventListener(CHANGE_EVENT, onChange);
  window.addEventListener("storage", onChange);
  return () => {
    window.removeEventListener(CHANGE_EVENT, onChange);
    window.removeEventListener("storage", onChange);
  };
}

function readStored(): ConsentSnapshot {
  try {
    const value = localStorage.getItem(CONSENT_KEY);
    return value === "granted" || value === "denied" ? value : "pending";
  } catch {
    // приватный режим или заблокированное хранилище — спрашиваем каждый раз
    return "pending";
  }
}

export function useConsent(): ConsentSnapshot {
  return useSyncExternalStore(subscribe, readStored, () => "unknown");
}

export function setConsent(state: ConsentState): void {
  try {
    localStorage.setItem(CONSENT_KEY, state);
  } catch {
    // не смогли запомнить — спросим в следующий раз, это не повод не применить выбор
  }

  const value = state === "granted" ? "granted" : "denied";
  window.gtag?.("consent", "update", {
    ad_storage: value,
    ad_user_data: value,
    ad_personalization: value,
    analytics_storage: value,
  });

  pushEvent({ event: "cookie_consent_update", consent_state: state });
  window.dispatchEvent(new Event(CHANGE_EVENT));
}
