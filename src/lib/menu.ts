"use client";

import { useSyncExternalStore } from "react";

/**
 * Открыто ли меню на телефоне.
 *
 * Источник правды — сам документ (`data-menu` на `<html>`), как и у темы:
 * состояние нужно и React-компонентам, и чистому CSS. От него зависят две вещи:
 * блокировка прокрутки и запрет шапке прятаться, пока меню открыто.
 */
const CHANGE_EVENT = "cargo:menuchange";

function subscribe(onChange: () => void) {
  window.addEventListener(CHANGE_EVENT, onChange);
  return () => window.removeEventListener(CHANGE_EVENT, onChange);
}

export function setMenuOpen(open: boolean): void {
  const root = document.documentElement;
  if (open) root.dataset.menu = "open";
  else delete root.dataset.menu;

  window.dispatchEvent(new Event(CHANGE_EVENT));
}

export function useMenuOpen(): boolean {
  return useSyncExternalStore(
    subscribe,
    () => document.documentElement.dataset.menu === "open",
    () => false,
  );
}
