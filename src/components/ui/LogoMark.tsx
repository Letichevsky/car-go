import brand from "@/data/brand.json";

/**
 * Знак Car-Go!
 *
 * Файлов два: дом, человечки и подпись в логотипе почти чёрные и на тёмной теме
 * пропадают, поэтому у тёмного варианта инвертировано серое (синий и красный
 * остались собой). Какой показать — решает CSS в globals.css: Tailwind-вариант
 * `dark:` смотрит только на системную настройку и про наш data-theme не знает.
 *
 * Размер задаётся снаружи высотой: `className="h-13"`.
 */
export function LogoMark({ className = "h-13" }: { className?: string }) {
  const size = { width: brand.logo.width, height: brand.logo.height };

  return (
    <>
      <picture>
        <img
          src="/brand/logo-light.png"
          alt=""
          {...size}
          className={`logo-mark--light w-auto ${className}`}
        />
      </picture>
      <picture>
        <img
          src="/brand/logo-dark.png"
          alt=""
          {...size}
          className={`logo-mark--dark w-auto ${className}`}
        />
      </picture>
    </>
  );
}
