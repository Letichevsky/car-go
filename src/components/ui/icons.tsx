import type { SVGProps } from "react";

/**
 * Иконки набора: штриховые, сетка 24, толщина линии задаётся снаружи.
 * Эмодзи как иконки не используем — они не тинтуются и по-разному выглядят на платформах.
 */
type IconProps = SVGProps<SVGSVGElement>;

const base = {
  viewBox: "0 0 24 24",
  fill: "none",
  stroke: "currentColor",
  strokeLinecap: "round",
  strokeLinejoin: "round",
  "aria-hidden": true,
  focusable: false,
} as const;

export function CheckIcon(props: IconProps) {
  return (
    <svg {...base} strokeWidth={2.4} {...props}>
      <polyline points="20 6 9 17 4 12" />
    </svg>
  );
}

export function ArrowRightIcon(props: IconProps) {
  return (
    <svg {...base} strokeWidth={2.2} {...props}>
      <line x1="5" y1="12" x2="19" y2="12" />
      <polyline points="12 5 19 12 12 19" />
    </svg>
  );
}

export function ChevronRightIcon(props: IconProps) {
  return (
    <svg {...base} strokeWidth={2.2} {...props}>
      <polyline points="9 18 15 12 9 6" />
    </svg>
  );
}

export function ChatIcon(props: IconProps) {
  return (
    <svg {...base} strokeWidth={2} {...props}>
      <path d="M21 15a2 2 0 0 1-2 2H7l-4 4V5a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2z" />
    </svg>
  );
}

export function PhoneIcon(props: IconProps) {
  return (
    <svg {...base} strokeWidth={2} {...props}>
      <path d="M22 16.9v3a2 2 0 0 1-2.2 2 19.8 19.8 0 0 1-8.6-3.1 19.5 19.5 0 0 1-6-6A19.8 19.8 0 0 1 2.1 4.2 2 2 0 0 1 4.1 2h3a2 2 0 0 1 2 1.7c.1 1 .4 1.9.7 2.8a2 2 0 0 1-.5 2.1L8.1 9.9a16 16 0 0 0 6 6l1.3-1.2a2 2 0 0 1 2.1-.5c.9.3 1.8.6 2.8.7a2 2 0 0 1 1.7 2z" />
    </svg>
  );
}

export function HomeIcon(props: IconProps) {
  return (
    <svg {...base} strokeWidth={1.7} {...props}>
      <path d="M3 10.5 12 3l9 7.5" />
      <path d="M5 9.5V21h14V9.5" />
      <path d="M10 21v-6h4v6" />
    </svg>
  );
}

export function OfficeIcon(props: IconProps) {
  return (
    <svg {...base} strokeWidth={1.7} {...props}>
      <rect x="3" y="3" width="8" height="18" />
      <rect x="13" y="8" width="8" height="13" />
      <path d="M6 7h2M6 11h2M6 15h2M16 12h2M16 16h2" />
    </svg>
  );
}

export function CartIcon(props: IconProps) {
  return (
    <svg {...base} strokeWidth={1.7} {...props}>
      <circle cx="9" cy="20" r="1.4" />
      <circle cx="18" cy="20" r="1.4" />
      <path d="M2 3h3l2.6 12h11L21 7H6.2" />
    </svg>
  );
}

export function BoxIcon(props: IconProps) {
  return (
    <svg {...base} strokeWidth={1.7} {...props}>
      <path d="M3 8.5 12 4l9 4.5-9 4.5z" />
      <path d="M3 8.5V16l9 4.5 9-4.5V8.5" />
      <path d="M12 13v7.5" />
    </svg>
  );
}

export function SunIcon(props: IconProps) {
  return (
    <svg {...base} strokeWidth={2} {...props}>
      <circle cx="12" cy="12" r="4" />
      <path d="M12 2v2M12 20v2M4.9 4.9l1.4 1.4M17.7 17.7l1.4 1.4M2 12h2M20 12h2M4.9 19.1l1.4-1.4M17.7 6.3l1.4-1.4" />
    </svg>
  );
}

export function MoonIcon(props: IconProps) {
  return (
    <svg {...base} strokeWidth={2} {...props}>
      <path d="M21 12.8A9 9 0 1 1 11.2 3a7 7 0 0 0 9.8 9.8z" />
    </svg>
  );
}

export function MenuIcon(props: IconProps) {
  return (
    <svg {...base} strokeWidth={2} {...props}>
      <line x1="4" y1="7" x2="20" y2="7" />
      <line x1="4" y1="12" x2="20" y2="12" />
      <line x1="4" y1="17" x2="20" y2="17" />
    </svg>
  );
}

export function CloseIcon(props: IconProps) {
  return (
    <svg {...base} strokeWidth={2} {...props}>
      <line x1="6" y1="6" x2="18" y2="18" />
      <line x1="18" y1="6" x2="6" y2="18" />
    </svg>
  );
}

export function KeyIcon(props: IconProps) {
  return (
    <svg {...base} strokeWidth={1.8} {...props}>
      <circle cx="7.5" cy="15.5" r="4" />
      <path d="M10.5 12.5 20 3" />
      <path d="M17 6l2.5 2.5" />
      <path d="M14.5 8.5 17 11" />
    </svg>
  );
}

export function TruckIcon(props: IconProps) {
  return (
    <svg {...base} strokeWidth={1.8} {...props}>
      <path d="M3 6h11v10H3z" />
      <path d="M14 9h4l3 3v4h-7z" />
      <circle cx="7" cy="18" r="2" />
      <circle cx="17.5" cy="18" r="2" />
    </svg>
  );
}

export function StarIcon(props: IconProps) {
  return (
    <svg {...base} strokeWidth={1.6} fill="currentColor" {...props}>
      <path d="m12 3.5 2.6 5.3 5.9.9-4.3 4.1 1 5.8-5.2-2.7-5.2 2.7 1-5.8L3.5 9.7l5.9-.9z" />
    </svg>
  );
}

export function PinIcon(props: IconProps) {
  return (
    <svg {...base} strokeWidth={1.8} {...props}>
      <path d="M12 21s7-5.6 7-11a7 7 0 1 0-14 0c0 5.4 7 11 7 11z" />
      <circle cx="12" cy="10" r="2.6" />
    </svg>
  );
}

export function PlusIcon(props: IconProps) {
  return (
    <svg {...base} strokeWidth={2} {...props}>
      <path d="M12 5v14M5 12h14" />
    </svg>
  );
}

export function AwardIcon(props: IconProps) {
  return (
    <svg {...base} strokeWidth={1.8} {...props}>
      <circle cx="12" cy="9" r="5.5" />
      <path d="M8.5 13.5 7 21l5-2.5 5 2.5-1.5-7.5" />
    </svg>
  );
}

export function UsersIcon(props: IconProps) {
  return (
    <svg {...base} strokeWidth={1.8} {...props}>
      <circle cx="9" cy="8" r="3.2" />
      <path d="M3.5 19.5c0-3 2.5-5 5.5-5s5.5 2 5.5 5" />
      <path d="M16 5.6a3.2 3.2 0 0 1 0 6.3" />
      <path d="M17.5 14.9c1.9.6 3.2 2.3 3.2 4.6" />
    </svg>
  );
}

export function WeightIcon(props: IconProps) {
  return (
    <svg {...base} strokeWidth={1.8} {...props}>
      <circle cx="12" cy="5" r="2.4" />
      <path d="M8.6 8.5h6.8l3.1 12H5.5z" />
    </svg>
  );
}

export function RouteIcon(props: IconProps) {
  return (
    <svg {...base} strokeWidth={1.8} {...props}>
      <circle cx="5.5" cy="5.5" r="2.5" />
      <circle cx="18.5" cy="18.5" r="2.5" />
      <path d="M8 5.5h6.5a3.5 3.5 0 0 1 0 7h-5a3.5 3.5 0 0 0 0 7H16" />
    </svg>
  );
}

export function TagIcon(props: IconProps) {
  return (
    <svg {...base} strokeWidth={1.8} {...props}>
      <path d="M12.6 3H21v8.4l-9.3 9.3a1.5 1.5 0 0 1-2.1 0l-6.3-6.3a1.5 1.5 0 0 1 0-2.1z" />
      <circle cx="17" cy="7" r="1.4" />
    </svg>
  );
}

/*
 * Ключ и отвёртка — из набора Phosphor (лицензия MIT). Они нарисованы заливкой,
 * а не обводкой, поэтому у этой иконки свои атрибуты и сетка 256.
 */
const WRENCH_PATH =
  "M226.76,69a8,8,0,0,0-12.84-2.88l-40.3,37.19-17.23-3.7-3.7-17.23,37.19-40.3A8,8,0,0,0,187,29.24,72,72,0,0,0,88,96,72.34,72.34,0,0,0,94,124.94L33.79,177c-.15.12-.29.26-.43.39a32,32,0,0,0,45.26,45.26c.13-.13.27-.28.39-.42L131.06,162A72,72,0,0,0,232,96,71.56,71.56,0,0,0,226.76,69ZM160,152a56.14,56.14,0,0,1-27.07-7,8,8,0,0,0-9.92,1.77L67.11,211.51a16,16,0,0,1-22.62-22.62L109.18,133a8,8,0,0,0,1.77-9.93,56,56,0,0,1,58.36-82.31l-31.2,33.81a8,8,0,0,0-1.94,7.1L141.83,108a8,8,0,0,0,6.14,6.14l26.35,5.66a8,8,0,0,0,7.1-1.94l33.81-31.2A56.06,56.06,0,0,1,160,152Z";
const SCREWDRIVER_PATH =
  "M205.66,50.32a8,8,0,0,1,0,11.32l-56,56a8,8,0,0,1-11.32-11.31l56-56A8,8,0,0,1,205.66,50.32ZM248,58.41a50.13,50.13,0,0,1-14.77,35.66L180,147.3A15.86,15.86,0,0,1,168.69,152H152v16.83a16,16,0,0,1-3.25,9.66,8.08,8.08,0,0,1-.72.83l-8,8a16,16,0,0,1-22.62,0L98.7,168.6l-77,77.06a8,8,0,0,1-11.32-11.32l77.05-77.05-18.7-18.71a16,16,0,0,1,0-22.63l8-8a8,8,0,0,1,.82-.72A16.14,16.14,0,0,1,87.17,104H104V87.3A15.92,15.92,0,0,1,108.68,76l53.24-53.23A50.43,50.43,0,0,1,248,58.41Zm-16,0a34.43,34.43,0,0,0-58.77-24.35L120,87.3V104a16,16,0,0,1-16,16H87.28L80,127.27,128.72,176l7.28-7.28V152a16,16,0,0,1,16-16h16.69l53.23-53.24A34.21,34.21,0,0,0,232,58.41Z";

/** Ключ ложится по одной диагонали, отвёртка — зеркально по другой */
const WRENCH_AT = "translate(128,128) scale(0.8) translate(-128,-128)";
const SCREWDRIVER_AT =
  "translate(256,0) scale(-1,1) translate(128,128) scale(0.72) translate(-128,-128)";

/**
 * Ключ с отвёрткой — сборка и разборка мебели.
 *
 * В месте пересечения ключ подрезан маской по контуру отвёртки: две толстые
 * формы внахлёст сливаются в кашу. Именно маска, а не обводка цветом фона —
 * тогда иконка остаётся честной на любой подложке, светлой и тёмной.
 */
export function ToolsIcon(props: IconProps) {
  return (
    <svg viewBox="0 0 256 256" fill="currentColor" aria-hidden focusable={false} {...props}>
      <mask id="cargo-tools-cut">
        <rect width="256" height="256" fill="#fff" />
        <g transform={SCREWDRIVER_AT}>
          <path
            d={SCREWDRIVER_PATH}
            fill="none"
            stroke="#000"
            strokeWidth={26}
            strokeLinejoin="round"
          />
        </g>
      </mask>
      <g mask="url(#cargo-tools-cut)" transform={WRENCH_AT}>
        <path d={WRENCH_PATH} />
      </g>
      <g transform={SCREWDRIVER_AT}>
        <path d={SCREWDRIVER_PATH} />
      </g>
    </svg>
  );
}

/** Двое несут коробку — погрузка и разгрузка */
export function MoversIcon(props: IconProps) {
  return (
    <svg {...base} strokeWidth={1.8} {...props}>
      <circle cx="4.2" cy="6.2" r="1.8" />
      <circle cx="19.8" cy="6.2" r="1.8" />
      <path d="M4.2 8.3v4M19.8 8.3v4" />
      <path d="M2.8 20.4 4.2 12.3l1.5 8.1M18.4 20.4l1.4-8.1 1.5 8.1" />
      <path d="M7.6 10.4h8.8v5.4H7.6z" />
      <path d="M5 10.9h2.6M16.4 10.9H19" />
    </svg>
  );
}
