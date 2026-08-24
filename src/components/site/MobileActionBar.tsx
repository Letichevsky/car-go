import { useTranslations } from "next-intl";
import { ChatIcon } from "@/components/ui/icons";
import { contacts } from "@/lib/contacts";

/**
 * Липкая панель на телефоне: WhatsApp и главное действие всегда под большим пальцем.
 * Учитывает safe-area, чтобы не залезать под системную полосу iOS.
 */
export function MobileActionBar() {
  const t = useTranslations();

  return (
    <div className="border-border bg-bg/95 fixed inset-x-0 bottom-0 z-50 border-t backdrop-blur lg:hidden">
      <div
        className="grid grid-cols-[3.5rem_1fr] gap-3 px-5 py-3"
        style={{ paddingBottom: "calc(0.75rem + env(safe-area-inset-bottom))" }}
      >
        <a
          href={contacts.whatsappHref}
          target="_blank"
          rel="noopener noreferrer"
          aria-label={t("actions.whatsappShort")}
          className="rounded-control border-border-strong text-info flex h-[3.25rem] items-center justify-center border"
        >
          <ChatIcon className="size-[1.375rem]" />
        </a>
        <a
          href="#contacts"
          className="rounded-control bg-action text-on-action flex h-[3.25rem] items-center justify-center text-base font-bold"
        >
          {t("actions.estimate")}
        </a>
      </div>
    </div>
  );
}
