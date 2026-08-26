import { useTranslations } from "next-intl";
import { StarIcon } from "@/components/ui/icons";
import { Reveal } from "@/components/ui/Reveal";

type Sample = { author: string; city: string; text: string };

/**
 * Отзывы. Реальных пока нет: заказчик ещё не сказал, что можно публиковать
 * и есть ли профиль Google Business (§12 журнала). Поэтому карточки помечены
 * как пример оформления — увидеть вёрстку можно, спутать с настоящими нельзя.
 *
 * Когда отзывы появятся, они придут из CMS, а плашка-предупреждение уйдёт вместе
 * с `samples`. Разметки Review в schema.org здесь намеренно нет: размечать
 * выдуманные отзывы — прямое нарушение правил Google.
 */
export function Reviews() {
  const t = useTranslations("reviews");
  const samples = t.raw("samples") as Sample[];

  if (samples.length === 0) return null;

  return (
    <section
      id="reviews"
      data-analytics-zone="reviews"
      className="mx-auto w-full max-w-7xl px-5 py-14 lg:px-14 lg:py-16"
    >
      <Reveal from="up">
        <div className="mb-8 flex flex-col gap-2">
          <h2 className="text-[1.75rem] font-bold tracking-[-0.035em] lg:text-4xl">{t("title")}</h2>
          <p className="text-text-muted max-w-[38rem] text-[0.9375rem] leading-relaxed">
            {t("subtitle")}
          </p>
        </div>
      </Reveal>

      <div className="grid gap-4 md:grid-cols-3">
        {samples.map((review, index) => (
          <Reveal key={review.author} from="up" delay={index * 80}>
            <figure className="border-border rounded-card flex h-full flex-col gap-4 border p-6">
              <span className="text-chevron flex gap-0.5" aria-hidden>
                {Array.from({ length: 5 }).map((_, star) => (
                  <StarIcon key={star} className="size-4" />
                ))}
              </span>
              <blockquote className="text-[0.9375rem] leading-relaxed">{review.text}</blockquote>
              <figcaption className="text-text-muted mt-auto text-[0.875rem] font-semibold">
                {review.author} · {review.city}
              </figcaption>
            </figure>
          </Reveal>
        ))}
      </div>

      <p className="border-border-strong text-text-muted rounded-card mt-4 border border-dashed px-4 py-3 text-[0.8125rem] leading-relaxed">
        {t("sampleNote")}
      </p>
    </section>
  );
}
