"use client";

import { useCallback, useEffect, useRef } from "react";
import { createPortal } from "react-dom";
import { useTranslations } from "next-intl";
import { photos as allPhotos, srcSet } from "@/lib/photos";
import { ChevronRightIcon, CloseIcon } from "@/components/ui/icons";

type LightboxProps = {
  /** Индекс кадра в общем наборе */
  index: number;
  onClose: () => void;
  onChange: (index: number) => void;
};

/**
 * Просмотр кадра поверх страницы.
 *
 * Рисуется порталом в body: у ленты есть маска по краям, а маска обрезает
 * потомков — даже с position: fixed окно оказалось бы подрезанным.
 */
export function PhotoLightbox({ index, onClose, onChange }: LightboxProps) {
  const t = useTranslations("gallery");
  const dialog = useRef<HTMLDivElement>(null);

  const photo = allPhotos[index];
  const webp = photo.variants.filter((variant) => variant.format === "webp");

  const go = useCallback(
    (step: number) => onChange((index + step + allPhotos.length) % allPhotos.length),
    [index, onChange],
  );

  useEffect(() => {
    const onKey = (event: KeyboardEvent) => {
      if (event.key === "Escape") onClose();
      if (event.key === "ArrowLeft") go(-1);
      if (event.key === "ArrowRight") go(1);
    };

    document.addEventListener("keydown", onKey);
    // страница под окном не должна прокручиваться
    const previousOverflow = document.body.style.overflow;
    document.body.style.overflow = "hidden";
    dialog.current?.focus();

    return () => {
      document.removeEventListener("keydown", onKey);
      document.body.style.overflow = previousOverflow;
    };
  }, [go, onClose]);

  return createPortal(
    <div
      ref={dialog}
      role="dialog"
      aria-modal="true"
      aria-label={t("title")}
      tabIndex={-1}
      // клик мимо снимка закрывает: слушаем сам фон, а не всплытие с кнопок
      onClick={(event) => {
        if (event.target === event.currentTarget) onClose();
      }}
      className="fixed inset-0 z-[100] flex items-center justify-center bg-black/85 p-4 backdrop-blur-sm lg:p-10"
    >
      <button
        type="button"
        onClick={onClose}
        aria-label={t("close")}
        className="rounded-control absolute top-4 right-4 flex size-11 cursor-pointer items-center justify-center border border-white/25 text-white transition-colors duration-200 hover:bg-white/10 lg:top-6 lg:right-6"
      >
        <CloseIcon className="size-5" />
      </button>

      <button
        type="button"
        onClick={() => go(-1)}
        aria-label={t("prev")}
        className="rounded-control absolute left-2 flex size-12 cursor-pointer items-center justify-center border border-white/25 text-white transition-colors duration-200 hover:bg-white/10 lg:left-6"
      >
        <ChevronRightIcon className="size-6 rotate-180" />
      </button>

      <figure className="flex max-h-full flex-col items-center gap-3">
        <picture>
          <source
            type="image/avif"
            srcSet={srcSet(photo, "avif")}
            sizes="(max-width: 1024px) 92vw, 80vw"
          />
          <img
            src={webp[webp.length - 1]?.src}
            srcSet={srcSet(photo, "webp")}
            sizes="(max-width: 1024px) 92vw, 80vw"
            alt={t(`alt.${photo.category}`)}
            className="max-h-[78vh] w-auto max-w-full object-contain"
          />
        </picture>
        <figcaption className="text-[0.8125rem] text-white/70">
          {index + 1} / {allPhotos.length} · {t(`alt.${photo.category}`)}
        </figcaption>
      </figure>

      <button
        type="button"
        onClick={() => go(1)}
        aria-label={t("next")}
        className="rounded-control absolute right-2 flex size-12 cursor-pointer items-center justify-center border border-white/25 text-white transition-colors duration-200 hover:bg-white/10 lg:right-6"
      >
        <ChevronRightIcon className="size-6" />
      </button>
    </div>,
    document.body,
  );
}
