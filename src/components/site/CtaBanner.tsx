import { useTranslations } from "next-intl";
import { LeadForm } from "@/components/site/LeadForm";
import { PhoneText } from "@/components/ui/PhoneText";
import { Reveal } from "@/components/ui/Reveal";
import { contacts } from "@/lib/contacts";

/** Красная плашка — единственное место, где действие занимает весь блок. */
export function CtaBanner() {
  const t = useTranslations();

  return (
    <section id="contacts" className="mx-auto w-full max-w-7xl px-5 pb-14 lg:px-14 lg:pb-16">
      <Reveal from="up">
        <div className="bg-action text-on-action rounded-card flex flex-col gap-8 p-8 lg:flex-row lg:items-center lg:justify-between lg:p-12">
          <div className="flex flex-col gap-2 lg:max-w-[24rem]">
            <h2 className="text-[1.75rem] leading-tight font-bold tracking-[-0.03em] lg:text-3xl">
              {t("cta.title")}
            </h2>
            <p className="text-on-action/85 text-base">{t("cta.text")}</p>
          </div>

          <div className="flex w-full flex-col gap-3 lg:w-[32rem]">
            <LeadForm tone="onAction" buttonLabel={t("cta.button")} />
            <p className="text-center text-[0.9375rem] font-semibold lg:text-right">
              <a href={contacts.phoneHref} className="hover:underline">
                <PhoneText />
              </a>
              <span aria-hidden> · </span>
              <a
                href={contacts.telegramHref}
                target="_blank"
                rel="noopener noreferrer"
                className="hover:underline"
              >
                {contacts.telegram}
              </a>
            </p>
          </div>
        </div>
      </Reveal>
    </section>
  );
}
