"use client";

import { useLocale } from "next-intl";
import { usePathname, useRouter } from "@/i18n/navigation";
import { localeLabels, localeNames, routing, type Locale } from "@/i18n/routing";

/** Переключатель языка: тот же путь, другая локаль. */
export function LocaleSwitcher({ className = "" }: { className?: string }) {
  const active = useLocale();
  const pathname = usePathname();
  const router = useRouter();

  return (
    <div className={`flex items-center gap-3 text-sm font-semibold ${className}`}>
      {routing.locales.map((locale: Locale) => (
        <button
          key={locale}
          type="button"
          onClick={() => router.replace(pathname, { locale })}
          aria-current={locale === active ? "true" : undefined}
          aria-label={localeNames[locale]}
          className={`cursor-pointer transition-colors duration-200 ${
            locale === active ? "text-text" : "text-text-muted hover:text-text-secondary"
          }`}
        >
          {localeLabels[locale]}
        </button>
      ))}
    </div>
  );
}
