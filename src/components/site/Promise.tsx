import { useTranslations } from "next-intl";
import { ChatIcon, CheckIcon, PhoneIcon } from "@/components/ui/icons";
import { Reveal } from "@/components/ui/Reveal";
import { contacts } from "@/lib/contacts";

/**
 * Главная мысль заказчика: клиенту не нужно ничего организовывать.
 * Отдельный блок, а не строчка в списке преимуществ, — это то, за чем к нему приходят.
 */
export function PromiseBlock() {
  const t = useTranslations();
  const points = t.raw("promise.points") as string[];

  return (
    <section
      id="promise"
      data-analytics-zone="promise"
      className="mx-auto w-full max-w-7xl px-5 py-14 lg:px-14 lg:py-16"
    >
      <Reveal from="up">
        <div className="border-border bg-surface rounded-card grid gap-8 border p-8 lg:grid-cols-[1.1fr_0.9fr] lg:gap-14 lg:p-12">
          <div className="flex flex-col gap-4">
            <h2 className="text-[1.625rem] leading-tight font-bold tracking-[-0.035em] text-balance lg:text-[2.5rem]">
              {t("promise.title")}
            </h2>
            <p className="text-text-secondary text-[1.0625rem] leading-relaxed">
              {t("promise.text")}
            </p>
          </div>

          <div className="flex flex-col justify-center gap-5">
            <ul className="flex flex-col gap-3">
              {points.map((point) => (
                <li key={point} className="flex items-start gap-3 text-[1.0625rem] leading-snug">
                  <CheckIcon className="text-info mt-1 size-5 shrink-0" />
                  <span>{point}</span>
                </li>
              ))}
            </ul>

            <div className="flex flex-col gap-2.5 sm:flex-row">
              <a
                href={contacts.whatsappHref}
                target="_blank"
                rel="noopener noreferrer"
                className="rounded-control bg-action text-on-action hover:bg-action-hover inline-flex h-[3.25rem] flex-1 items-center justify-center gap-2 px-6 text-base font-bold transition-colors duration-200"
              >
                <ChatIcon className="size-[1.125rem]" />
                {t("actions.whatsappShort")}
              </a>
              <a
                href={contacts.phoneHref}
                className="rounded-control border-border-strong hover:border-info hover:text-info inline-flex h-[3.25rem] flex-1 items-center justify-center gap-2 border px-6 text-base font-semibold transition-colors duration-200"
              >
                <PhoneIcon className="size-[1.125rem]" />
                {t("actions.callNow")}
              </a>
            </div>
          </div>
        </div>
      </Reveal>
    </section>
  );
}
