"use client";

import { useEffect, useMemo, useRef, type CSSProperties, type PointerEvent } from "react";
import { useTranslations } from "next-intl";
import { photos as allPhotos, srcSet, type Photo } from "@/lib/photos";
import { useMediaQuery } from "@/lib/useMediaQuery";
import { useReducedMotion } from "@/lib/useReducedMotion";

/** Сколько кадров держим на облаке: на телефоне меньше — экономим память и кадр */
const COUNT_DESKTOP = 96;
const COUNT_MOBILE = 48;

/** Перспектива в радиусах: чем меньше значение, тем сильнее разница ближних и дальних */
const PERSPECTIVE = 2.4;
/** Насколько сильно дальние кадры ужимаются сверх перспективы (0 — никак, 1 — в точку) */
const DEPTH_SCALE = 0.72;
/** Степень затухания прозрачности по глубине */
const DEPTH_FADE = 2.2;

/** Максимальная скорость от курсора, радиан в секунду — облако листается спокойно */
const MAX_SPEED = 0.29;
/** Скорость спокойного вращения, когда курсора нет */
const IDLE_SPEED = 0.06;
/** Насколько быстро скорость догоняет заданную курсором */
const EASING = 0.08;
/** Затухание после свайпа */
const FRICTION = 0.94;

/**
 * Ступени тени по глубине. Меняем не каждый кадр, а только при переходе через порог:
 * пересчёт box-shadow на сотне элементов каждый кадр браузеру дорог.
 */
const SHADOWS = [
  "none",
  "0 4px 10px rgb(0 0 0 / 0.28)",
  "0 10px 22px rgb(0 0 0 / 0.45)",
  "0 18px 40px rgb(0 0 0 / 0.6)",
];

function shadowLevel(depth: number): number {
  if (depth > 0.78) return 3;
  if (depth > 0.6) return 2;
  if (depth > 0.42) return 1;
  return 0;
}

/** Пропорции кадра держим в этих границах: очень узкие снимки в облаке выглядят щепками */
const MIN_ASPECT = 0.55;
const MAX_ASPECT = 1.8;

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

/**
 * Поворот вокруг ЭКРАННЫХ осей, применяемый к самим координатам.
 *
 * Раньше углы копились отдельно и подставлялись в формулу поворота. Из-за этого
 * после наклона по вертикали «верх» облака уезжал назад, и горизонтальное вращение
 * читалось наоборот — облако будто переворачивалось. Здесь оси всегда экранные,
 * поэтому «справа кадры летят ко мне» верно при любом положении облака.
 */
function spin(point: Point, yaw: number, pitch: number) {
  if (yaw !== 0) {
    const cos = Math.cos(yaw);
    const sin = Math.sin(yaw);
    const x = point.x * cos + point.z * sin;
    point.z = -point.x * sin + point.z * cos;
    point.x = x;
  }
  if (pitch !== 0) {
    const cos = Math.cos(pitch);
    const sin = Math.sin(pitch);
    const y = point.y * cos - point.z * sin;
    point.z = point.y * sin + point.z * cos;
    point.y = y;
  }
}

/** Раскладка кадра: положение в долях радиуса, масштаб, прозрачность и слой */
function project(point: Point) {
  const depth = (point.z + 1) / 2; // 0 — самый дальний, 1 — самый ближний
  const perspective = PERSPECTIVE / (PERSPECTIVE - point.z);
  const scale = perspective * (1 - DEPTH_SCALE + DEPTH_SCALE * depth);

  return {
    x: point.x * perspective,
    y: point.y * perspective,
    scale,
    opacity: Number((0.04 + 0.96 * Math.pow(depth, DEPTH_FADE)).toFixed(3)),
    layer: Math.round(depth * 200),
  };
}

/**
 * Размер кадра считается от постоянной площади, а не от постоянной ширины:
 * иначе узкие вертикальные снимки выглядят мельче остальных, хотя формально
 * той же ширины. Пропорции при этом зажаты, чтобы не было «щепок».
 */
function frameBox(photo: Photo, area: number) {
  const aspect = Math.min(MAX_ASPECT, Math.max(MIN_ASPECT, photo.width / photo.height));
  return {
    width: Math.round(Math.sqrt(area * aspect)),
    height: Math.round(Math.sqrt(area / aspect)),
  };
}

export function PhotoSphere() {
  const t = useTranslations();
  const reduced = useReducedMotion();
  const mobile = useMediaQuery("(max-width: 767px)");
  const touch = useMediaQuery("(pointer: coarse)");

  const count = mobile ? COUNT_MOBILE : COUNT_DESKTOP;
  const area = touch ? 76 * 76 : 104 * 104;

  const wrap = useRef<HTMLDivElement>(null);
  const items = useRef<(HTMLElement | null)[]>([]);

  const speed = useRef({ pitch: 0, yaw: IDLE_SPEED });
  const target = useRef({ pitch: 0, yaw: IDLE_SPEED });
  const focused = useRef<number | null>(null);
  const dragging = useRef(false);

  const points = useMemo(() => fibonacciSphere(count), [count]);
  /** Живые координаты: их и вращаем, чтобы не копить углы */
  const live = useRef<Point[]>([]);

  /** Каждому месту на облаке — свой кадр; кадров больше, чем мест, поэтому берём с шагом */
  const frames = useMemo<Photo[]>(() => {
    const step = Math.max(1, Math.floor(allPhotos.length / count));
    return Array.from(
      { length: count },
      (_, index) => allPhotos[(index * step) % allPhotos.length],
    );
  }, [count]);

  useEffect(() => {
    const node = wrap.current;
    if (!node) return;

    live.current = points.map((point) => ({ ...point }));

    let frame = 0;
    let previous = 0;
    let running = false;
    let ticks = 0;

    const tick = (time: number) => {
      const dt = previous ? Math.min((time - previous) / 1000, 0.05) : 0.016;
      previous = time;

      let yaw = 0;
      let pitch = 0;

      if (focused.current !== null) {
        // доворот: каждый кадр подтягиваем выбранный снимок к центру
        const point = live.current[focused.current];
        const flat = Math.sqrt(point.x * point.x + point.z * point.z);
        // мягкий доворот: за кадр проходим малую долю оставшегося угла
        yaw = -Math.atan2(point.x, point.z) * 0.05;
        pitch = Math.atan2(point.y, flat) * 0.05;
        speed.current.pitch = 0;
        speed.current.yaw = 0;
        if (Math.abs(yaw) < 0.0004 && Math.abs(pitch) < 0.0004) focused.current = null;
      } else if (!dragging.current && !reduced) {
        speed.current.pitch += (target.current.pitch - speed.current.pitch) * EASING;
        speed.current.yaw += (target.current.yaw - speed.current.yaw) * EASING;
        yaw = speed.current.yaw * dt;
        pitch = speed.current.pitch * dt;
      }

      ticks += 1;
      const normalize = ticks % 120 === 0;

      for (let index = 0; index < live.current.length; index += 1) {
        const point = live.current[index];
        if (yaw !== 0 || pitch !== 0) spin(point, yaw, pitch);

        // накопленные повороты понемногу уводят точки со сферы — изредка возвращаем
        if (normalize) {
          const length = Math.sqrt(point.x * point.x + point.y * point.y + point.z * point.z) || 1;
          point.x /= length;
          point.y /= length;
          point.z /= length;
        }

        const element = items.current[index];
        if (!element) continue;

        const spot = project(point);
        element.style.setProperty("--x", spot.x.toFixed(4));
        element.style.setProperty("--y", spot.y.toFixed(4));
        element.style.setProperty("--s", spot.scale.toFixed(4));
        element.style.setProperty("--o", String(spot.opacity));
        element.style.zIndex = String(spot.layer);

        const level = shadowLevel((point.z + 1) / 2);
        if (element.dataset.shadow !== String(level)) {
          element.dataset.shadow = String(level);
          element.style.setProperty("--depth-shadow", SHADOWS[level]);
        }
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

    // Считаем кадры только когда облако на экране и вкладка активна:
    // иначе телефон крутит невидимые снимки и жжёт батарею.
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
  }, [points, reduced]);

  /** Курсор задаёт направление и скорость: в центре тихо, к краю быстрее */
  function onPointerMove(event: PointerEvent<HTMLDivElement>) {
    const node = wrap.current;
    if (!node) return;

    if (dragging.current) {
      const step = 0.005;
      for (const point of live.current)
        spin(point, -event.movementX * step, event.movementY * step);
      speed.current.yaw = -event.movementX * step * 60;
      speed.current.pitch = event.movementY * step * 60;
      return;
    }

    if (event.pointerType === "touch") return;

    const box = node.getBoundingClientRect();
    const dx = (event.clientX - box.left - box.width / 2) / (box.width / 2);
    const dy = (event.clientY - box.top - box.height / 2) / (box.height / 2);

    // знаки подобраны на живом облаке: кадры едут навстречу курсору
    focused.current = null;
    target.current = { pitch: dy * MAX_SPEED, yaw: -dx * MAX_SPEED };
  }

  function onPointerLeave() {
    dragging.current = false;
    target.current = { pitch: 0, yaw: IDLE_SPEED };
  }

  function onPointerDown(event: PointerEvent<HTMLDivElement>) {
    if (event.pointerType !== "touch") return;
    dragging.current = true;
    focused.current = null;
    event.currentTarget.setPointerCapture(event.pointerId);
  }

  function onPointerUp() {
    if (!dragging.current) return;
    dragging.current = false;

    // инерция: гасим накопленную скорость и возвращаемся к спокойному вращению
    const glide = () => {
      speed.current.yaw *= FRICTION;
      speed.current.pitch *= FRICTION;
      for (const point of live.current) {
        spin(point, speed.current.yaw * 0.016, speed.current.pitch * 0.016);
      }
      if (Math.abs(speed.current.yaw) + Math.abs(speed.current.pitch) > 0.02) {
        requestAnimationFrame(glide);
      } else {
        target.current = { pitch: 0, yaw: IDLE_SPEED };
      }
    };
    requestAnimationFrame(glide);
  }

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
          const box = frameBox(photo, area);
          // стартовая раскладка считается и на сервере: без JS кадры всё равно лежат облаком
          const spot = project(point);

          return (
            <button
              key={`${photo.slug}-${index}`}
              type="button"
              ref={(element) => {
                items.current[index] = element;
              }}
              onClick={() => {
                focused.current = index;
              }}
              aria-label={t(`gallery.alt.${photo.category}`)}
              className="sphere-frame rounded-control absolute top-1/2 left-1/2 cursor-pointer overflow-hidden will-change-transform"
              style={
                {
                  width: box.width,
                  height: box.height,
                  marginLeft: -box.width / 2,
                  marginTop: -box.height / 2,
                  "--x": spot.x.toFixed(4),
                  "--y": spot.y.toFixed(4),
                  "--s": spot.scale.toFixed(4),
                  "--o": spot.opacity,
                  "--depth-shadow": SHADOWS[shadowLevel((point.z + 1) / 2)],
                  transform:
                    "translate3d(calc(var(--x) * 36cqw), calc(var(--y) * 32cqh), 0) scale(var(--s))",
                  zIndex: spot.layer,
                } as CSSProperties
              }
            >
              <picture>
                <source type="image/avif" srcSet={srcSet(photo, "avif")} sizes="7rem" />
                <img
                  src={webp[0]?.src}
                  srcSet={srcSet(photo, "webp")}
                  sizes="7rem"
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
