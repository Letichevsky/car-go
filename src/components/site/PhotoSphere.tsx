"use client";

import {
  useCallback,
  useEffect,
  useMemo,
  useRef,
  type CSSProperties,
  type PointerEvent,
} from "react";
import { useTranslations } from "next-intl";
import { photos as allPhotos, srcSet, type Photo } from "@/lib/photos";
import { useMediaQuery } from "@/lib/useMediaQuery";
import { useReducedMotion } from "@/lib/useReducedMotion";

/** Сколько кадров держим на облаке: на телефоне меньше — экономим память и кадр */
const COUNT_DESKTOP = 96;
const COUNT_MOBILE = 48;

/**
 * Перспектива в радиусах: чем больше значение, тем меньше разброс масштабов.
 * Держим умеренной, чтобы ближние кадры не вылетали за края полосы.
 */
const PERSPECTIVE = 3.4;
/** Максимальная скорость от курсора, радиан в секунду */
const MAX_SPEED = 0.58;
/** Скорость спокойного вращения, когда курсора нет */
const IDLE_SPEED = 0.06;
/** Насколько быстро скорость догоняет заданную курсором */
const EASING = 0.08;
/** Затухание после свайпа */
const FRICTION = 0.94;

type Point = { x: number; y: number; z: number };

/**
 * Точки равномерно по сфере (спираль Фибоначчи): без сгущения у полюсов,
 * которое даёт наивная сетка по широте и долготе.
 */
function fibonacciSphere(count: number): Point[] {
  const golden = Math.PI * (3 - Math.sqrt(5));
  return Array.from({ length: count }, (_, index) => {
    const y = 1 - (index / (count - 1)) * 2;
    const radius = Math.sqrt(Math.max(0, 1 - y * y));
    const theta = golden * index;
    return { x: Math.cos(theta) * radius, y, z: Math.sin(theta) * radius };
  });
}

/** Поворот точки вокруг Y, затем вокруг X */
function rotate(point: Point, rotX: number, rotY: number): Point {
  const cosY = Math.cos(rotY);
  const sinY = Math.sin(rotY);
  const x = point.x * cosY + point.z * sinY;
  const z1 = -point.x * sinY + point.z * cosY;

  const cosX = Math.cos(rotX);
  const sinX = Math.sin(rotX);
  const y = point.y * cosX - z1 * sinX;
  const z = point.y * sinX + z1 * cosX;

  return { x, y, z };
}

/** Кратчайший путь между углами: без него доворот делает лишний оборот */
function shortestDelta(from: number, to: number): number {
  const twoPi = Math.PI * 2;
  return ((((to - from) % twoPi) + Math.PI * 3) % twoPi) - Math.PI;
}

export function PhotoSphere() {
  const t = useTranslations();
  const reduced = useReducedMotion();

  const mobile = useMediaQuery("(max-width: 767px)");
  const touch = useMediaQuery("(pointer: coarse)");
  const count = mobile ? COUNT_MOBILE : COUNT_DESKTOP;

  const wrap = useRef<HTMLDivElement>(null);
  const items = useRef<(HTMLElement | null)[]>([]);

  const angles = useRef({ x: -0.15, y: 0 });
  const speed = useRef({ x: 0, y: IDLE_SPEED });
  const target = useRef({ x: 0, y: IDLE_SPEED });
  const focus = useRef<{ x: number; y: number } | null>(null);
  const dragging = useRef(false);

  const points = useMemo(() => fibonacciSphere(count), [count]);

  /** Каждому месту на сфере — свой кадр; кадров больше, чем мест, поэтому берём с шагом */
  const frames = useMemo<Photo[]>(() => {
    const step = Math.max(1, Math.floor(allPhotos.length / count));
    return Array.from(
      { length: count },
      (_, index) => allPhotos[(index * step) % allPhotos.length],
    );
  }, [count]);

  /**
   * Раскладка одного кадра. Координаты — доли радиуса, сам радиус живёт в CSS
   * (единицы контейнера), поэтому раскладка одинаково верна и на сервере, и на любом экране.
   */
  const place = useCallback((point: Point, rotX: number, rotY: number) => {
    const turned = rotate(point, rotX, rotY);
    const scale = PERSPECTIVE / (PERSPECTIVE - turned.z);
    return {
      x: turned.x * scale,
      y: turned.y * scale,
      scale,
      depth: turned.z,
      opacity: Number((0.22 + ((turned.z + 1) / 2) * 0.78).toFixed(3)),
      layer: Math.round((turned.z + 1) * 100),
    };
  }, []);

  useEffect(() => {
    const node = wrap.current;
    if (!node) return;

    let frame = 0;
    let previous = 0;
    let running = false;

    const tick = (time: number) => {
      const dt = previous ? Math.min((time - previous) / 1000, 0.05) : 0.016;
      previous = time;

      if (focus.current) {
        // доворот к выбранному кадру
        const dx = shortestDelta(angles.current.x, focus.current.x);
        const dy = shortestDelta(angles.current.y, focus.current.y);
        angles.current.x += dx * 0.12;
        angles.current.y += dy * 0.12;
        speed.current.x = 0;
        speed.current.y = 0;
        if (Math.abs(dx) < 0.004 && Math.abs(dy) < 0.004) focus.current = null;
      } else if (dragging.current) {
        // палец ведёт сферу напрямую, скорость копится для инерции
      } else if (reduced) {
        speed.current.x = 0;
        speed.current.y = 0;
      } else {
        speed.current.x += (target.current.x - speed.current.x) * EASING;
        speed.current.y += (target.current.y - speed.current.y) * EASING;
        angles.current.x += speed.current.x * dt;
        angles.current.y += speed.current.y * dt;
      }

      for (let index = 0; index < points.length; index += 1) {
        const element = items.current[index];
        if (!element) continue;

        const spot = place(points[index], angles.current.x, angles.current.y);
        element.style.setProperty("--x", spot.x.toFixed(4));
        element.style.setProperty("--y", spot.y.toFixed(4));
        element.style.setProperty("--s", spot.scale.toFixed(4));
        element.style.opacity = spot.opacity.toFixed(3);
        element.style.zIndex = String(spot.layer);
      }

      frame = requestAnimationFrame(tick);
    };

    const start = () => {
      if (running) return;
      running = true;
      previous = 0;
      frame = requestAnimationFrame(tick);
    };

    const stop = () => {
      running = false;
      cancelAnimationFrame(frame);
    };

    // Считаем кадры только когда сфера на экране и вкладка активна:
    // иначе телефон крутит невидимый шар и жжёт батарею.
    const observer = new IntersectionObserver(
      (entries) => (entries.some((entry) => entry.isIntersecting) ? start() : stop()),
      { rootMargin: "10% 0px" },
    );
    observer.observe(node);

    const onVisibility = () => (document.hidden ? stop() : start());
    document.addEventListener("visibilitychange", onVisibility);

    return () => {
      observer.disconnect();
      document.removeEventListener("visibilitychange", onVisibility);
      stop();
    };
  }, [points, place, reduced]);

  /** Курсор задаёт направление и скорость: в центре тихо, к краю быстрее */
  function onPointerMove(event: PointerEvent<HTMLDivElement>) {
    const node = wrap.current;
    if (!node) return;

    const box = node.getBoundingClientRect();
    const dx = (event.clientX - box.left - box.width / 2) / (box.width / 2);
    const dy = (event.clientY - box.top - box.height / 2) / (box.height / 2);

    if (dragging.current) {
      const scale = 0.005;
      angles.current.y += event.movementX * scale;
      angles.current.x -= event.movementY * scale;
      speed.current.y = event.movementX * scale * 60;
      speed.current.x = -event.movementY * scale * 60;
      return;
    }

    if (event.pointerType === "touch") return;

    focus.current = null;
    target.current = { x: -dy * MAX_SPEED, y: dx * MAX_SPEED };
  }

  function onPointerLeave() {
    dragging.current = false;
    target.current = { x: 0, y: IDLE_SPEED };
  }

  function onPointerDown(event: PointerEvent<HTMLDivElement>) {
    if (event.pointerType !== "touch") return;
    dragging.current = true;
    focus.current = null;
    event.currentTarget.setPointerCapture(event.pointerId);
  }

  function onPointerUp() {
    if (!dragging.current) return;
    dragging.current = false;

    // инерция: гасим накопленную скорость и возвращаемся к спокойному вращению
    const glide = () => {
      speed.current.x *= FRICTION;
      speed.current.y *= FRICTION;
      angles.current.x += speed.current.x * 0.016;
      angles.current.y += speed.current.y * 0.016;
      if (Math.abs(speed.current.x) + Math.abs(speed.current.y) > 0.02) {
        requestAnimationFrame(glide);
      } else {
        target.current = { x: 0, y: IDLE_SPEED };
      }
    };
    requestAnimationFrame(glide);
  }

  /** Тап или клик по кадру доворачивает сферу так, чтобы кадр оказался спереди */
  function focusOn(index: number) {
    const point = points[index];
    const rotY = Math.atan2(-point.x, point.z);
    const flat = Math.sqrt(point.x * point.x + point.z * point.z);
    const rotX = Math.atan2(point.y, flat);
    focus.current = { x: rotX, y: rotY };
  }

  const frameWidth = touch ? 78 : 104;

  return (
    <div className="flex flex-col gap-4">
      <div
        ref={wrap}
        onPointerMove={onPointerMove}
        onPointerLeave={onPointerLeave}
        onPointerDown={onPointerDown}
        onPointerUp={onPointerUp}
        onPointerCancel={onPointerUp}
        className="relative h-[20rem] w-full touch-none select-none sm:h-[24rem] lg:h-[30rem]"
        style={{ containerType: "size", isolation: "isolate" }}
      >
        {points.map((point, index) => {
          const photo = frames[index];
          const webp = photo.variants.filter((variant) => variant.format === "webp");
          // кадр сохраняет свои пропорции: вертикальные снимки остаются вертикальными
          const frameHeight = Math.round((frameWidth * photo.height) / photo.width);
          // стартовая раскладка считается и на сервере: без JS кадры всё равно лежат сферой
          const spot = place(point, -0.15, 0);

          return (
            <button
              key={`${photo.slug}-${index}`}
              type="button"
              ref={(element) => {
                items.current[index] = element;
              }}
              onClick={() => focusOn(index)}
              aria-label={t(`gallery.alt.${photo.category}`)}
              className="rounded-control absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 cursor-pointer overflow-hidden will-change-transform"
              style={
                {
                  width: frameWidth,
                  height: frameHeight,
                  marginLeft: -frameWidth / 2,
                  marginTop: -frameHeight / 2,
                  "--x": spot.x.toFixed(4),
                  "--y": spot.y.toFixed(4),
                  "--s": spot.scale.toFixed(4),
                  transform:
                    "translate3d(calc(var(--x) * 40cqw), calc(var(--y) * 36cqh), 0) scale(var(--s))",
                  opacity: spot.opacity,
                  zIndex: spot.layer,
                } as CSSProperties
              }
            >
              <picture>
                <source type="image/avif" srcSet={srcSet(photo, "avif")} sizes="6rem" />
                <img
                  src={webp[0]?.src}
                  srcSet={srcSet(photo, "webp")}
                  sizes="6rem"
                  alt=""
                  loading="lazy"
                  decoding="async"
                  className="size-full object-cover"
                />
              </picture>
            </button>
          );
        })}
      </div>

      <p className="text-text-muted text-center text-[0.8125rem]">
        {touch ? t("gallery.hintTouch") : t("gallery.hintMouse")}
      </p>
    </div>
  );
}
