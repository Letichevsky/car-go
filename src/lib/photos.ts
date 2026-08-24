import photosData from "@/data/photos.json";

export type PhotoCategory = "team" | "process" | "packing" | "assembly" | "result";

export type PhotoVariant = {
  width: number;
  format: string;
  src: string;
};

export type Photo = {
  slug: string;
  category: string;
  width: number;
  height: number;
  orientation: string;
  /** Крошечная размытая заглушка в base64 — стоит фоном, пока грузится кадр */
  lqip: string;
  variants: PhotoVariant[];
};

export const photos = photosData as Photo[];

export function getPhoto(slug: string): Photo {
  const photo = photos.find((item) => item.slug === slug);
  if (!photo) throw new Error(`Фото "${slug}" нет в src/data/photos.json`);
  return photo;
}

export function photosByCategory(category: PhotoCategory): Photo[] {
  return photos.filter((photo) => photo.category === category);
}

/** srcset одного формата: "…-480.avif 480w, …-960.avif 960w" */
export function srcSet(photo: Photo, format: string): string {
  return photo.variants
    .filter((variant) => variant.format === format)
    .sort((a, b) => a.width - b.width)
    .map((variant) => `${variant.src} ${variant.width}w`)
    .join(", ");
}

/** Самый крупный WebP — он же fallback для <img> */
export function fallbackSrc(photo: Photo): string {
  const webp = photo.variants.filter((variant) => variant.format === "webp");
  return webp[webp.length - 1]?.src ?? photo.variants[photo.variants.length - 1].src;
}
