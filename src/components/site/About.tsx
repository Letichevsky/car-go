import { useTranslations } from "next-intl";
import { Link } from "@/i18n/navigation";
import { Photo } from "@/components/ui/Photo";
import { ArrowRightIcon } from "@/components/ui/icons";
import { Reveal } from "@/components/ui/Reveal";

/**
 * Секция о команде: короткий рассказ и выходы к контенту — фотографии работ
 * и (позже) видео. Пока ролики не отобраны, карточка честно говорит, что они готовятся.
 */
export function About() {
  const t = useTranslations();

  const facts = [t("about.factYears"), t("about.factVans"), t("about.factLanguages")];

  return (
    <section id="about" className="mx-auto w-full max-w-7xl px-5 pb-14 lg:px-14 lg:pb-16">
      <div className="grid gap-8 lg:grid-cols-[0.95fr_1.05fr] lg:gap-14">
        <Reveal from="left">
          <div className="flex flex-col gap-5">
            <h2 className="text-[1.75rem] font-bold tracking-[-0.035em] lg:text-4xl">
              {t("about.title")}
            </h2>
            <p className="text-text-secondary text-[1.0625rem] leading-relaxed">
              {t("about.text")}
            </p>
            <ul className="flex flex-col gap-2.5">
              {facts.map((fact) => (
                <li key={fact} className="text-text-muted flex items-start gap-3 text-[0.9375rem]">
                  <span aria-hidden className="bg-info mt-2 block size-1.5 shrink-0 rounded-full" />
                  {fact}
                </li>
              ))}
            </ul>
          </div>
        </Reveal>

        <Reveal from="right" delay={120}>
          <div className="grid gap-4 sm:grid-cols-2">
            {/* Фото и подпись живут в разных зонах: никаких затемнений поверх кадра */}
            <Link
              href="/works"
              className="group border-border hover:border-info hover:shadow-card rounded-card flex cursor-pointer flex-col overflow-hidden border transition duration-300 ease-out hover:-translate-y-1.5"
            >
              <span className="bg-surface-strong block aspect-[4/3] overflow-hidden">
                <Photo
                  slug="img-2397"
                  alt=""
                  sizes="(max-width: 640px) 100vw, 22rem"
                  className="size-full object-cover transition-transform duration-500 ease-out group-hover:scale-[1.04]"
                />
              </span>
              <span className="flex items-center justify-between gap-3 p-5">
                <span className="flex flex-col gap-1">
                  <span className="text-lg font-bold">{t("about.photosTitle")}</span>
                  <span className="text-text-muted text-[0.875rem]">{t("about.photosText")}</span>
                </span>
                <ArrowRightIcon className="text-info size-5 shrink-0 transition-transform duration-300 ease-out group-hover:translate-x-1" />
              </span>
            </Link>

            <div className="border-border bg-surface rounded-card flex flex-col overflow-hidden border border-dashed">
              <span className="bg-surface-strong text-text-muted flex aspect-[4/3] items-center justify-center px-4 text-center text-[0.8125rem]">
                {t("about.videoSoon")}
              </span>
              <span className="flex flex-col gap-1 p-5">
                <span className="text-lg font-bold">{t("about.videoTitle")}</span>
                <span className="text-text-muted text-[0.875rem]">{t("about.videoText")}</span>
              </span>
            </div>
          </div>
        </Reveal>
      </div>
    </section>
  );
}
