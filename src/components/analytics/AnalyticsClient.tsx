"use client";

import { useEffect, useRef } from "react";
import { usePathname } from "next/navigation";
import { routing, type Locale } from "@/i18n/routing";
import { resolveRoute, worksSlug } from "@/data/routes";
import { pushEvent, zoneOf, type PageType } from "@/lib/analytics";

/**
 * Один клиентский компонент на весь сайт: просмотры страниц и клики по контактам.
 *
 * Клики ловятся делегированием — один слушатель на документ вместо обработчика
 * на каждой ссылке. Секции остаются серверными, в бандл не уезжает ничего лишнего,
 * а ссылки, которые заказчик когда-нибудь вставит из админки, отследятся сами.
 */
export function AnalyticsClient() {
  const pathname = usePathname();
  const lastPath = useRef<string | null>(null);

  // Переходы в App Router клиентские: обычного page_view у GTM не будет, шлём свой
  useEffect(() => {
    const { locale, type } = describe(pathname);

    // Заголовок вкладки Next меняет в своём эффекте — если прочитать его сразу,
    // при клиентском переходе приедет заголовок предыдущей страницы или пустая строка.
    // Проверка адреса стоит внутри таймера: в dev StrictMode эффект перезапускается,
    // и снаружи она отменила бы единственную оставшуюся отправку.
    const timer = window.setTimeout(() => {
      if (lastPath.current === pathname) return;
      lastPath.current = pathname;

      pushEvent({
        event: "page_view",
        page_path: pathname + window.location.search,
        page_title: document.title,
        page_locale: locale,
        page_type: type,
      });
    }, 0);

    return () => window.clearTimeout(timer);
  }, [pathname]);

  useEffect(() => {
    const onClick = (event: MouseEvent) => {
      const target = event.target;
      if (!(target instanceof Element)) return;
      const link = target.closest("a[href]");
      if (!(link instanceof HTMLAnchorElement)) return;
      // ссылки с этой пометкой к заявкам отношения не имеют (например, подпись разработчика)
      if (link.closest("[data-analytics-skip]")) return;

      const href = link.getAttribute("href") ?? "";
      const lead_location = zoneOf(link);

      if (href.startsWith("tel:")) {
        pushEvent({ event: "phone_click", lead_location });
      } else if (href.includes("wa.me") || href.includes("api.whatsapp.com")) {
        pushEvent({ event: "whatsapp_click", lead_location });
      } else if (href.includes("t.me/")) {
        pushEvent({ event: "telegram_click", lead_location });
      }
    };

    // capture: событие дойдёт, даже если кто-то остановит всплытие
    document.addEventListener("click", onClick, true);
    return () => document.removeEventListener("click", onClick, true);
  }, []);

  return null;
}

function describe(pathname: string): { locale: string; type: PageType } {
  const [first = "", second = ""] = pathname.replace(/^\//, "").split("/");
  const locale = (routing.locales as readonly string[]).includes(first)
    ? (first as Locale)
    : routing.defaultLocale;

  if (!second) return { locale, type: "home" };
  if (second === worksSlug) return { locale, type: "works" };

  const route = resolveRoute(locale as Locale, second);
  if (route?.kind === "contacts") return { locale, type: "contacts" };
  if (route?.kind === "service") return { locale, type: "service" };
  return { locale, type: "other" };
}
