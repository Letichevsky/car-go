/**
 * Единственное место, где код знает про dataLayer.
 *
 * Мы не зашиваем в сайт ни GA4, ни Google Ads: страница только кладёт в dataLayer
 * осмысленные события, а какие теги на них навесить — решают в интерфейсе GTM.
 * Так маркетолог меняет отслеживание без релиза сайта, а мы не тащим в бандл
 * второй загрузчик тегов.
 *
 * Карта событий и что с ними делать в GTM — docs/analytics.md.
 */

/** Где на странице произошло действие. Ставится атрибутом на секцию, см. ANALYTICS_ZONE. */
export type LeadZone = string;

export type AnalyticsEvent =
  /** Отправлена форма заявки (уходит в WhatsApp) */
  | { event: "lead_form_submit"; lead_location: LeadZone; lead_method: "whatsapp" }
  /** Клик по ссылке WhatsApp */
  | { event: "whatsapp_click"; lead_location: LeadZone }
  /** Клик по номеру телефона */
  | { event: "phone_click"; lead_location: LeadZone }
  /** Клик по Telegram */
  | { event: "telegram_click"; lead_location: LeadZone }
  /** Просмотр страницы: в App Router переходы клиентские, обычного page_view не будет */
  | {
      event: "page_view";
      page_path: string;
      page_title: string;
      page_locale: string;
      page_type: PageType;
    }
  /** Ответ на баннер согласия — чтобы теги могли ждать именно его */
  | { event: "cookie_consent_update"; consent_state: "granted" | "denied" };

export type PageType = "home" | "works" | "contacts" | "service" | "other";

/** Атрибут-маркер зоны: ближайший предок с ним даёт lead_location событию. */
export const ANALYTICS_ZONE = "data-analytics-zone";

declare global {
  interface Window {
    dataLayer?: unknown[];
    /** Определяется инлайн-скриптом согласия до загрузки GTM */
    gtag?: (...args: unknown[]) => void;
  }
}

/** Идентификатор контейнера GTM. Пусто — аналитика не грузится вообще. */
export const gtmId = (process.env.NEXT_PUBLIC_GTM_ID ?? "").trim();

export function pushEvent(payload: AnalyticsEvent): void {
  if (typeof window === "undefined") return;
  window.dataLayer = window.dataLayer ?? [];
  window.dataLayer.push(payload);
}

/** Ближайшая секция-зона над элементом: hero, cta, header, footer, mobile-bar… */
export function zoneOf(element: Element | null | undefined): LeadZone {
  return element?.closest(`[${ANALYTICS_ZONE}]`)?.getAttribute(ANALYTICS_ZONE) ?? "unknown";
}
