/**
 * Знак VL — подпись разработчика.
 *
 * Тот же контур, что в портфолио и в Black Fox, но обводкой `currentColor`:
 * так знак сам подстраивается под светлую и тёмную тему, а не тащит за собой
 * второй файл под каждую.
 */
export function VLMark({ className }: { className?: string }) {
  return (
    <svg
      viewBox="0 0 372 272"
      fill="none"
      aria-hidden
      focusable={false}
      className={className}
      xmlns="http://www.w3.org/2000/svg"
    >
      <path d="M6 6l95 260" stroke="currentColor" strokeWidth={12} strokeLinecap="round" />
      <path d="M201 6l-55 145" stroke="currentColor" strokeWidth={12} strokeLinecap="round" />
      <path d="M246 6v260" stroke="currentColor" strokeWidth={12} strokeLinecap="round" />
      <path d="M286 266h80" stroke="currentColor" strokeWidth={12} strokeLinecap="round" />
    </svg>
  );
}
