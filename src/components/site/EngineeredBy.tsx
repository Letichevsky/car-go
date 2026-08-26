import { VLMark } from "@/components/ui/VLMark";

/** Знак ведёт на сайт разработчика */
const SITE = "https://letichevsky.com/";
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
 * Ссылка помечена `data-analytics-skip`: это переход к разработчику, а не заявка.
 * Сейчас трекер её и так не считает, но пометка останется верной, даже если
 * адрес однажды поменяют на мессенджер.
 */
export function EngineeredBy() {
  return (
    <div className="border-border border-t">
      <div className="mx-auto flex w-full max-w-7xl items-center justify-center px-5 pt-14 pb-[calc(var(--action-bar-space)+3.5rem)] lg:px-14">
        <a
          href={SITE}
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
