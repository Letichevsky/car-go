"use client";

import { useCallback, useEffect, useRef, useState } from "react";
import { getPhoto, srcSet } from "@/lib/photos";

/**
 * Смена кадра без вздрагивания: новый снимок сначала грузится в память,
 * и только потом проявляется поверх старого. Старый убираем, когда переход закончился,
 * поэтому ни пустого места, ни мыла из заглушки в кадре не появляется.
 */
export function Tile({
  slug,
  span,
  sizes,
  alt,
  delay,
  onHover,
}: {
  slug: string;
  span: string;
  sizes: string;
  alt: string;
  delay: number;
  onHover?: () => void;
}) {
  const frame = useRef<HTMLElement>(null);
  const [base, setBase] = useState(slug);
  const [incoming, setIncoming] = useState<string | null>(null);
  const [axis, setAxis] = useState<"x" | "y">("x");

  useEffect(() => {
    if (slug === base) return;

    let cancelled = false;
    const photo = getPhoto(slug);

    const reveal = () => {
      if (cancelled) return;
      // длинная сторона именно у того прямоугольника, который видит человек
      const box = frame.current?.getBoundingClientRect();
      setAxis(box && box.height > box.width ? "y" : "x");
      setIncoming(slug);
    };

    const loader = new Image();
    loader.sizes = sizes;
    loader.onload = reveal;
    loader.onerror = () => {
      // формат не поддержан — пробуем webp; не выйдет и он, просто меняем кадр
      const fallback = new Image();
      fallback.sizes = sizes;
      fallback.onload = reveal;
      fallback.onerror = reveal;
      fallback.srcset = srcSet(photo, "webp");
    };
    loader.srcset = srcSet(photo, "avif");

    return () => {
      cancelled = true;
    };
  }, [slug, base, sizes]);

  const settle = useCallback(() => {
    setIncoming((current) => {
      if (current) setBase(current);
      return null;
    });
  }, []);

  // Подстраховка: если вкладка была в фоне и анимация не отыграла, слой всё равно схлопнется
  useEffect(() => {
    if (!incoming) return;
    const timer = window.setTimeout(settle, 1400);
    return () => window.clearTimeout(timer);
  }, [incoming, settle]);

  const backface = axis === "x" ? "rotateX(180deg)" : "rotateY(180deg)";

  return (
    <figure
      ref={frame}
      className={`bg-surface-strong relative overflow-hidden ${span}`}
      style={{
        animation: `tile-in 600ms cubic-bezier(0.22, 1, 0.36, 1) ${delay}ms both`,
        perspective: "40rem",
      }}
      onMouseEnter={onHover}
    >
      <div
        className="relative size-full"
        style={{
          transformStyle: "preserve-3d",
          animation: incoming
            ? `tile-flip-${axis} 720ms cubic-bezier(0.45, 0.05, 0.3, 1) both`
            : undefined,
        }}
        onAnimationEnd={settle}
      >
        <TileFace slug={base} alt={incoming ? "" : alt} sizes={sizes} />
        {incoming && (
          <TileFace key={incoming} slug={incoming} alt={alt} sizes={sizes} transform={backface} />
        )}
      </div>
    </figure>
  );
}

/**
 * Грань переворота. Трансформация и скрытие изнанки висят на <picture>:
 * если оставить их на <img>, тег picture создаст собственный плоский контекст,
 * и вместо обратной стороны будет видно зеркальную переднюю.
 */
function TileFace({
  slug,
  alt,
  sizes,
  transform,
}: {
  slug: string;
  alt: string;
  sizes: string;
  transform?: string;
}) {
  const photo = getPhoto(slug);
  const webp = photo.variants.filter((variant) => variant.format === "webp");

  return (
    <picture
      className="absolute inset-0 block size-full"
      style={{
        backfaceVisibility: "hidden",
        WebkitBackfaceVisibility: "hidden",
        transform,
      }}
    >
      <source type="image/avif" srcSet={srcSet(photo, "avif")} sizes={sizes} />
      <img
        src={webp[webp.length - 1]?.src}
        srcSet={srcSet(photo, "webp")}
        sizes={sizes}
        alt={alt}
        loading="lazy"
        decoding="async"
        className="size-full object-cover"
      />
    </picture>
  );
}
