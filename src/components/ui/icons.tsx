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

export function ToolIcon(props: IconProps) {
  return (
    <svg {...base} strokeWidth={1.7} {...props}>
      <path d="M14.7 6.3a4 4 0 0 1 5 5L9 22l-5-5z" />
      <path d="m18 2 4 4" />
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
