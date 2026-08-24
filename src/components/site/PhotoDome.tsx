"use client";

import { useEffect, useMemo, useRef, type PointerEvent } from "react";
import { useTranslations } from "next-intl";
import { photos as allPhotos, srcSet, type Photo } from "@/lib/photos";
import { useMediaQuery } from "@/lib/useMediaQuery";
import { useReducedMotion } from "@/lib/useReducedMotion";

const COUNT_DESKTOP = 84;
const COUNT_MOBILE = 44;

const MAX_SPEED = 0.29;
const IDLE_SPEED = 0.06;
const EASING = 0.08;
const FRICTION = 0.94;
/** Во сколько раз медленнее крутится облако, пока курсор стоит на кадре */
const HOVER_BRAKE = 0.12;

/**
 * Сторона квадратного кадра в долях радиуса купола.
 * На сфере радиуса R для N точек на каждую приходится площадка со стороной
 * примерно 3.54·R/√N. Берём чуть меньше — тогда кадры сходятся углами,
 * но не залезают друг на друга.
 */
const TILE_DESKTOP = "15cqmin";
const TILE_MOBILE = "20cqmin";

type Point = { x: number; y: number; z: number };

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
 * Матрица поворота 3×3, row-major. Копим именно её, а не углы: умножение слева
 * поворачивает вокруг ЭКРАННЫХ осей, поэтому купол не переворачивается,
 * сколько его ни крути.
 */
type Matrix = number[];

const IDENTITY: Matrix = [1, 0, 0, 0, 1, 0, 0, 0, 1];

function multiply(a: Matrix, b: Matrix): Matrix {
  const out = new Array<number>(9);
  for (let row = 0; row < 3; row += 1) {
    for (let col = 0; col < 3; col += 1) {
      out[row * 3 + col] =
        a[row * 3] * b[col] + a[row * 3 + 1] * b[3 + col] + a[row * 3 + 2] * b[6 + col];
    }
  }
  return out;
}

function yawMatrix(angle: number): Matrix {
  const c = Math.cos(angle);
  const s = Math.sin(angle);
  return [c, 0, s, 0, 1, 0, -s, 0, c];
}

function pitchMatrix(angle: number): Matrix {
  const c = Math.cos(angle);
  const s = Math.sin(angle);
  return [1, 0, 0, 0, c, -s, 0, s, c];
}

function apply(matrix: Matrix, point: Point): Point {
  return {
    x: matrix[0] * point.x + matrix[1] * point.y + matrix[2] * point.z,
    y: matrix[3] * point.x + matrix[4] * point.y + matrix[5] * point.z,
    z: matrix[6] * point.x + matrix[7] * point.y + matrix[8] * point.z,
  };
}

/** CSS ждёт матрицу по столбцам */
function toCss(m: Matrix): string {
  return `matrix3d(${m[0]},${m[3]},${m[6]},0,${m[1]},${m[4]},${m[7]},0,${m[2]},${m[5]},${m[8]},0,0,0,0,1)`;
}

/**
 * Кадры наклеены на сферу: каждый развёрнут нормалью наружу, поэтому боковые
 * видны ребром, а те, что на дальней стороне, не видны вовсе (изнанка скрыта).
 * Вращается один контейнер — все кадры едут вместе, без пересчёта в JS.
 */
export function PhotoDome() {
  const t = useTranslations();
  const reduced = useReducedMotion();
  const mobile = useMediaQuery("(max-width: 767px)");
  const touch = useMediaQuery("(pointer: coarse)");

  const count = mobile ? COUNT_MOBILE : COUNT_DESKTOP;
  const tile = mobile ? TILE_MOBILE : TILE_DESKTOP;

  const wrap = useRef<HTMLDivElement>(null);
  const stage = useRef<HTMLDivElement>(null);

  const rotation = useRef<Matrix>([...IDENTITY]);
  const speed = useRef({ pitch: 0, yaw: IDLE_SPEED });
  const target = useRef({ pitch: 0, yaw: IDLE_SPEED });
  const focused = useRef<number | null>(null);
  const dragging = useRef(false);
  /** Курсор стоит на кадре — почти останавливаемся, иначе снимок уезжает и подсветка слетает */
  const hovering = useRef(false);

  const points = useMemo(() => fibonacciSphere(count), [count]);

  const frames = useMemo<Photo[]>(() => {
    const step = Math.max(1, Math.floor(allPhotos.length / count));
    return Array.from(
      { length: count },
      (_, index) => allPhotos[(index * step) % allPhotos.length],
    );
  }, [count]);

  /** Поворот купола вокруг экранных осей */
  function turn(yaw: number, pitch: number) {
    if (yaw === 0 && pitch === 0) return;
    let next = rotation.current;
    if (yaw !== 0) next = multiply(yawMatrix(yaw), next);
    if (pitch !== 0) next = multiply(pitchMatrix(pitch), next);
    rotation.current = next;
  }

  useEffect(() => {
    const node = wrap.current;
    const scene = stage.current;
    if (!node || !scene) return;

    let frame = 0;
    let previous = 0;
    let running = false;

    const tick = (time: number) => {
      const dt = previous ? Math.min((time - previous) / 1000, 0.05) : 0.016;
      previous = time;

      if (focused.current !== null) {
        // мягкий доворот выбранного кадра к центру
        const spot = apply(rotation.current, points[focused.current]);
        const flat = Math.sqrt(spot.x * spot.x + spot.z * spot.z);
        const yaw = -Math.atan2(spot.x, spot.z) * 0.05;
        const pitch = Math.atan2(spot.y, flat) * 0.05;
        turn(yaw, pitch);
        speed.current = { pitch: 0, yaw: 0 };
        if (Math.abs(yaw) < 0.0004 && Math.abs(pitch) < 0.0004) focused.current = null;
      } else if (!dragging.current && !reduced) {
        const brake = hovering.current ? HOVER_BRAKE : 1;
        speed.current.pitch += (target.current.pitch * brake - speed.current.pitch) * EASING;
        speed.current.yaw += (target.current.yaw * brake - speed.current.yaw) * EASING;
        turn(speed.current.yaw * dt, speed.current.pitch * dt);
      }

      scene.style.transform = toCss(rotation.current);
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

  function onPointerMove(event: PointerEvent<HTMLDivElement>) {
    const node = wrap.current;
    if (!node) return;

    if (dragging.current) {
      const step = 0.005;
      turn(-event.movementX * step, event.movementY * step);
      speed.current.yaw = -event.movementX * step * 60;
      speed.current.pitch = event.movementY * step * 60;
      return;
    }

    if (event.pointerType === "touch") return;

    const box = node.getBoundingClientRect();
    const dx = (event.clientX - box.left - box.width / 2) / (box.width / 2);
    const dy = (event.clientY - box.top - box.height / 2) / (box.height / 2);

    focused.current = null;
    target.current = { pitch: dy * MAX_SPEED, yaw: -dx * MAX_SPEED };
  }

  function onPointerLeave() {
    dragging.current = false;
    hovering.current = false;
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

    const glide = () => {
      speed.current.yaw *= FRICTION;
      speed.current.pitch *= FRICTION;
      turn(speed.current.yaw * 0.016, speed.current.pitch * 0.016);
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
        className="relative h-[20rem] w-full touch-none select-none sm:h-[26rem] lg:h-[32rem]"
        style={{ containerType: "size", perspective: "70rem" }}
      >
        <div
          ref={stage}
          className="absolute top-1/2 left-1/2 size-0"
          style={{ transformStyle: "preserve-3d" }}
        >
          {points.map((point, index) => {
            const photo = frames[index];
            const webp = photo.variants.filter((variant) => variant.format === "webp");

            // кадр разворачивается нормалью наружу и выносится на поверхность сферы
            const yaw = (Math.atan2(point.x, point.z) * 180) / Math.PI;
            const pitch = (-Math.asin(Math.max(-1, Math.min(1, point.y))) * 180) / Math.PI;

            return (
              <button
                key={`${photo.slug}-${index}`}
                type="button"
                onClick={() => {
                  focused.current = index;
                }}
                onPointerEnter={() => (hovering.current = true)}
                onPointerLeave={() => (hovering.current = false)}
                aria-label={t(`gallery.alt.${photo.category}`)}
                className="dome-frame rounded-control absolute cursor-pointer overflow-hidden"
                style={{
                  // квадрат: на сфере кадры сходятся углами и не наезжают друг на друга
                  width: tile,
                  height: tile,
                  marginLeft: `calc(${tile} / -2)`,
                  marginTop: `calc(${tile} / -2)`,
                  transform: `rotateY(${yaw.toFixed(2)}deg) rotateX(${pitch.toFixed(2)}deg) translateZ(40cqmin)`,
                }}
              >
                <picture>
                  <source type="image/avif" srcSet={srcSet(photo, "avif")} sizes="7rem" />
                  <img
                    src={webp[0]?.src}
                    srcSet={srcSet(photo, "webp")}
                    sizes="7rem"
                    alt=""
                    // в 3D-сцене браузер плохо определяет видимость, поэтому грузим сразу:
                    // кадры мелкие, весь купол весит меньше одного крупного снимка
                    loading="eager"
                    decoding="async"
                    className="size-full object-cover"
                  />
                </picture>
              </button>
            );
          })}
        </div>
      </div>

      <p className="text-text-muted text-center text-[0.8125rem]">
        {touch ? t("gallery.hintTouch") : t("gallery.hintMouse")}
      </p>
    </div>
  );
}
