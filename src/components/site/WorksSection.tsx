import { useTranslations } from "next-intl";
import { GalleryFlow } from "@/components/site/GalleryFlow";
import { Link } from "@/i18n/navigation";
import { ArrowRightIcon } from "@/components/ui/icons";
import { Reveal } from "@/components/ui/Reveal";

export function WorksSection() {
  const t = useTranslations();

  return (
    <section id="works" className="mx-auto w-full max-w-7xl px-5 py-14 lg:px-14 lg:py-16">
      <Reveal from="up">
        <div className="mb-7 flex flex-wrap items-end justify-between gap-4">
          <div className="flex flex-col gap-2">
            <h2 className="text-[1.75rem] font-bold tracking-[-0.035em] lg:text-4xl">
              {t("gallery.title")}
            </h2>
            <p className="text-text-muted max-w-[38rem] text-[0.9375rem] leading-relaxed">
              {t("gallery.subtitle")}
            </p>
          </div>
          <Link
            href="/works"
            className="text-info hover:text-info-hover inline-flex items-center gap-2 text-[0.9375rem] font-semibold transition-colors duration-200"
          >
            {t("gallery.all")}
            <ArrowRightIcon className="size-[1.0625rem]" />
          </Link>
        </div>
      </Reveal>

      <GalleryFlow />
    </section>
  );
}
