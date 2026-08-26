import { VLMark } from "@/components/ui/VLMark";

/** Подпись разработчика: та же ссылка, что в остальных проектах */
const CONTACT = "https://t.me/vlcontact";
/** Не переводится: это подпись, она одинакова во всех локалях */
const LABEL = "Engineered by";

/**
 * Полоска под основным подвалом: знак по центру, подпись под ним.
 *
 * Знак — единственный элемент в потоке, поэтому стоит ровно по центру, а текст
 * лежит абсолютом и в раскладке не участвует: иначе он сдвигал бы знак вбок.
 *
 * Ссылка помечена `data-analytics-skip`: это адрес разработчика, а не канал
 * заявок, и в статистике переходов в Telegram ему делать нечего.
 */
export function EngineeredBy() {
  return (
    <div className="mx-auto w-full max-w-7xl px-5 pb-28 lg:px-14 lg:pb-10">
      <div aria-hidden className="bg-border h-px w-full rounded-full" />

      <div className="relative flex items-center justify-center py-7">
        <a
          href={CONTACT}
          target="_blank"
          rel="noopener noreferrer"
          data-analytics-skip
          aria-label={`${LABEL} VL`}
          className="text-text-muted hover:text-text block transition-colors duration-300"
        >
          <VLMark className="h-7 w-auto md:h-8" />
        </a>
        <span
          aria-hidden
          className="text-text-muted pointer-events-none absolute bottom-1 left-1/2 -translate-x-1/2 text-[10px] tracking-[0.2em] uppercase opacity-70"
        >
          {LABEL}
        </span>
      </div>
    </div>
  );
}
