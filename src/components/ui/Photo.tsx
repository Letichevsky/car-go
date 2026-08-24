import { fallbackSrc, getPhoto, srcSet } from "@/lib/photos";

type PhotoProps = {
  slug: string;
  alt: string;
  /** Значение атрибута sizes — сколько места кадр занимает на каждом брейкпоинте */
  sizes: string;
  className?: string;
  /** Для кадра в первом экране: грузим сразу, без ленивой загрузки */
  priority?: boolean;
};

/**
 * Кадр отдаётся готовыми вариантами AVIF/WebP из public/photos — без рантайм-оптимизации
 * хостинга. Пока файл летит, место занимает размытая заглушка, поэтому вёрстка не прыгает.
 */
export function Photo({ slug, alt, sizes, className, priority = false }: PhotoProps) {
  const photo = getPhoto(slug);

  return (
    <picture>
      <source type="image/avif" srcSet={srcSet(photo, "avif")} sizes={sizes} />
      <source type="image/webp" srcSet={srcSet(photo, "webp")} sizes={sizes} />
      <img
        src={fallbackSrc(photo)}
        alt={alt}
        width={photo.width}
        height={photo.height}
        loading={priority ? "eager" : "lazy"}
        fetchPriority={priority ? "high" : "auto"}
        decoding="async"
        className={className}
        style={{
          backgroundImage: `url(${photo.lqip})`,
          backgroundSize: "cover",
          backgroundPosition: "center",
        }}
      />
    </picture>
  );
}
