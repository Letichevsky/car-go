import type { PhotoCategory } from "@/lib/photos";

/**
 * Пять направлений работы. `slug` живёт в адресе страницы и одинаков для всех языков —
 * локализованные адреса добавим отдельной задачей, когда согласуем формулировки с заказчиком.
 * `key` — ключ в переводах, `photos` — из какой категории брать кадры для страницы.
 */
export type ServiceKey = "home" | "office" | "delivery" | "loading" | "assembly";

export type Service = {
  slug: string;
  key: ServiceKey;
  photos: PhotoCategory;
};

export const services: Service[] = [
  { slug: "apartment-moves", key: "home", photos: "packing" },
  { slug: "office-moves", key: "office", photos: "process" },
  { slug: "delivery", key: "delivery", photos: "result" },
  { slug: "loading", key: "loading", photos: "process" },
  { slug: "furniture-assembly", key: "assembly", photos: "assembly" },
];

export function findService(slug: string): Service | undefined {
  return services.find((service) => service.slug === slug);
}
