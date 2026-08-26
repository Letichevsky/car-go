import { VLMark } from "@/components/ui/VLMark";

/** Подпись разработчика: та же ссылка, что в остальных проектах */
const CONTACT = "https://t.me/vlcontact";
/** Не переводится: это подпись, она одинакова во всех локалях */
const LABEL = "Engineered by";

/**
 * Полоска под основным подвалом: знак по центру, подпись под ним.
 *
 * Разделитель во всю ширину экрана, а не по ширине контента — полоска читается
 * как отдельный этаж страницы, а не как ещё один блок подвала. Размеры и
 * типографика те же, что на letichevsky.com: знак 40 px, подпись моноширинным
 * с широким трекингом, много воздуха сверху и снизу.
 *
 * Нижний запас берётся из `--action-bar-space`: пока липкая панель на телефоне
 * не выехала, подпись не висит над пустотой.
 *
 * Ссылка помечена `data-analytics-skip`: это адрес разработчика, а не канал
 * заявок, и в статистике переходов в Telegram ему делать нечего.
 */
export function EngineeredBy() {
  return (
    <div className="border-border border-t">
      <div className="mx-auto flex w-full max-w-7xl items-center justify-center px-5 pt-14 pb-[calc(var(--action-bar-space)+3.5rem)] lg:px-14">
        <a
          href={CONTACT}
          target="_blank"
          rel="noopener noreferrer"
          data-analytics-skip
          aria-label={`${LABEL} VL`}
          className="group flex flex-col items-center gap-3"
        >
          <VLMark className="text-text group-hover:text-text-muted h-10 w-auto transition-colors duration-300 ease-out" />
          <span className="text-text-muted font-mono text-[10px] tracking-[0.4em] uppercase">
            {LABEL}
          </span>
        </a>
      </div>
    </div>
  );
}
