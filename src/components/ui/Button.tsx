import type { ComponentPropsWithoutRef, ReactNode } from "react";

type Variant = "action" | "outline" | "quiet";

const variants: Record<Variant, string> = {
  // красный = действие; на странице это главная кнопка и только она
  action: "bg-action text-on-action hover:bg-action-hover border border-transparent",
  outline: "border border-border-strong text-text hover:border-info hover:text-info bg-transparent",
  quiet: "text-info hover:text-info-hover border border-transparent bg-transparent",
};

type ButtonLinkProps = ComponentPropsWithoutRef<"a"> & {
  variant?: Variant;
  children: ReactNode;
};

/**
 * Кнопки на странице — ссылки: они ведут в WhatsApp, на телефон или к форме.
 * Минимальная высота 3.25rem — палец на телефоне попадает без промаха.
 */
export function ButtonLink({
  variant = "action",
  className = "",
  children,
  ...props
}: ButtonLinkProps) {
  return (
    <a
      className={`rounded-control inline-flex min-h-[3.25rem] cursor-pointer items-center justify-center gap-2 px-7 text-base font-bold transition-colors duration-200 ${variants[variant]} ${className}`}
      {...props}
    >
      {children}
    </a>
  );
}
