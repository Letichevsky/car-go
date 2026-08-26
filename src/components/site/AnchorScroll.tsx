"use client";

import { useEffect } from "react";
import { usePathname } from "next/navigation";
import { HEADER_HIDE_AFTER, headerOffset } from "@/lib/header";

/**
 * Переходы по якорям внутри страницы.
 *
 * Штатного поведения браузера не хватает по двум причинам. Первая: отступ под
 * шапку нужен только когда прыгаем вверх — вниз она уезжает сама, и
 * зарезервированное место превращается в пустоту над заголовком. Вторая: якорь
 * в адресе делает повторное нажатие того же пункта меню бесполезным — адрес не
 * меняется, и ничего не происходит. Поэтому прокрутку считаем сами, а решётку
 * в адресе не оставляем.
 *
 * Слушатель один на весь документ и стоит на фазе перехвата: Next Link сначала
 * зовёт onClick самого компонента (например, «закрыть меню»), а потом смотрит
 * на defaultPrevented и не начинает переход. Так закрытие меню работает,
 * а лишней навигации нет.
 */
export function AnchorScroll() {
  const pathname = usePathname();

  useEffect(() => {
    const onClick = (event: MouseEvent) => {
      if (event.defaultPrevented || event.button !== 0) return;
      if (event.metaKey || event.ctrlKey || event.shiftKey || event.altKey) return;

      const target = event.target;
      const link = target instanceof Element ? target.closest("a[href]") : null;
      if (!(link instanceof HTMLAnchorElement) || link.target === "_blank") return;

      const url = new URL(link.href, window.location.href);
      if (url.origin !== window.location.origin) return;
      // ссылка на другую страницу — это работа роутера, не наша
      if (url.pathname !== window.location.pathname) return;
      if (url.hash.length < 2) return;

      const section = document.getElementById(decodeURIComponent(url.hash.slice(1)));
      if (!section) return;

      event.preventDefault();
      dropHash();
      scrollToSection(section);
    };

    document.addEventListener("click", onClick, true);
    return () => document.removeEventListener("click", onClick, true);
  }, []);

  // Пришли на страницу со ссылки с якорем: роутер уже прокрутил по своим
  // правилам, поправляем отступ мгновенно и убираем решётку из адреса
  useEffect(() => {
    const hash = window.location.hash;
    if (hash.length < 2) return;

    const section = document.getElementById(decodeURIComponent(hash.slice(1)));
    if (!section) return;

    const timer = window.setTimeout(() => {
      scrollToSection(section, "auto");
      dropHash();
    }, 0);

    return () => window.clearTimeout(timer);
  }, [pathname]);

  return null;
}

function scrollToSection(section: Element, behavior?: ScrollBehavior) {
  const top = section.getBoundingClientRect().top + window.scrollY;
  // вниз шапка уедет сама — резервировать место под неё не нужно
  const headerHides = top > window.scrollY && top > HEADER_HIDE_AFTER;
  const reduced = window.matchMedia("(prefers-reduced-motion: reduce)").matches;

  window.scrollTo({
    top: Math.max(0, top - (headerHides ? 0 : headerOffset())),
    behavior: behavior ?? (reduced ? "auto" : "smooth"),
  });
}

/** Убрать якорь из адреса, не трогая роутер и не плодя записей в истории */
function dropHash() {
  if (!window.location.hash) return;
  const clean = window.location.pathname + window.location.search;
  window.history.replaceState(window.history.state, "", clean);
}
