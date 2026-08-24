"use client";

import { useCallback, useSyncExternalStore } from "react";

/**
 * Медиазапрос как источник состояния. Через useSyncExternalStore, а не через
 * setState в эффекте: React сам разводит серверный снимок и клиентский.
 */
export function useMediaQuery(query: string, serverValue = false): boolean {
  const subscribe = useCallback(
    (onChange: () => void) => {
      const media = window.matchMedia(query);
      media.addEventListener("change", onChange);
      return () => media.removeEventListener("change", onChange);
    },
    [query],
  );

  return useSyncExternalStore(
    subscribe,
    () => window.matchMedia(query).matches,
    () => serverValue,
  );
}
