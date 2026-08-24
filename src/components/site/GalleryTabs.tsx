"use client";

import { useState } from "react";
import { useTranslations } from "next-intl";
import { Gallery } from "@/components/site/Gallery";
import { GalleryFlow } from "@/components/site/GalleryFlow";

type View = "flow" | "mosaic";

/**
 * Две подачи одной мозаики: едущая влево и статичная.
 * Обе оставлены, чтобы заказчик выбрал вживую, а не по описанию.
 */
export function GalleryTabs() {
  const t = useTranslations("gallery");
  const [view, setView] = useState<View>("flow");

  const tabs: { id: View; label: string }[] = [
    { id: "flow", label: t("tabFlow") },
    { id: "mosaic", label: t("tabMosaic") },
  ];

  return (
    <div className="flex flex-col gap-6">
      <div
        role="tablist"
        aria-label={t("title")}
        className="border-border bg-surface rounded-control flex w-fit gap-1 border p-1"
      >
        {tabs.map((tab) => (
          <button
            key={tab.id}
            type="button"
            role="tab"
            aria-selected={view === tab.id}
            onClick={() => setView(tab.id)}
            className={`rounded-control cursor-pointer px-4 py-2 text-[0.875rem] font-semibold transition duration-200 ${
              view === tab.id
                ? "bg-bg text-text shadow-card"
                : "text-text-muted hover:text-text-secondary"
            }`}
          >
            {tab.label}
          </button>
        ))}
      </div>

      {view === "flow" ? <GalleryFlow /> : <Gallery />}
    </div>
  );
}
