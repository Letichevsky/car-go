"use client";

import { useId, useState, type FormEvent } from "react";
import { useTranslations } from "next-intl";
import { contacts } from "@/lib/contacts";

type Tone = "default" | "onAction";

const tones: Record<Tone, { field: string; button: string; hint: string; error: string }> = {
  default: {
    field:
      "bg-bg border-border-strong text-text placeholder:text-text-muted focus:border-info h-[3.25rem] w-full rounded-control border px-4 text-base outline-none transition-colors duration-200",
    button:
      "bg-action text-on-action hover:bg-action-hover h-[3.25rem] shrink-0 cursor-pointer rounded-control px-7 text-base font-bold transition-colors duration-200",
    hint: "text-text-muted text-[0.8125rem] leading-relaxed",
    error: "text-action text-[0.8125rem] font-semibold",
  },
  onAction: {
    field:
      "bg-bg border-transparent text-text placeholder:text-text-muted h-[3.25rem] w-full rounded-control border px-4 text-base outline-none",
    button:
      "bg-text text-bg h-[3.25rem] shrink-0 cursor-pointer rounded-control px-7 text-base font-bold transition-opacity duration-200 hover:opacity-90",
    hint: "text-on-action/85 text-[0.8125rem] leading-relaxed",
    error: "text-on-action text-[0.8125rem] font-semibold",
  },
};

/**
 * Заявка уходит в WhatsApp с подставленным номером клиента: бэкенда пока нет,
 * а переписка в мессенджере — то, чем Паша реально пользуется.
 * Когда появится API и телеграм-бот, поменяется только эта функция.
 */
export function LeadForm({ tone = "default", buttonLabel }: { tone?: Tone; buttonLabel: string }) {
  const t = useTranslations("form");
  const styles = tones[tone];
  const fieldId = useId();
  const [phone, setPhone] = useState("");
  const [invalid, setInvalid] = useState(false);

  function submit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    const value = phone.trim();

    // хотя бы шесть цифр — иначе связаться всё равно не получится
    if ((value.match(/\d/g) ?? []).length < 6) {
      setInvalid(true);
      return;
    }

    setInvalid(false);
    const text = `${t("waPrefix")} ${value}`;
    window.open(`${contacts.whatsappHref}?text=${encodeURIComponent(text)}`, "_blank", "noopener");
  }

  return (
    <form onSubmit={submit} className="flex flex-col gap-2.5" noValidate>
      <div className="flex flex-col gap-2.5 sm:flex-row">
        <label htmlFor={fieldId} className="sr-only">
          {t("label")}
        </label>
        <input
          id={fieldId}
          type="tel"
          inputMode="tel"
          autoComplete="tel"
          name="phone"
          placeholder={t("placeholder")}
          value={phone}
          onChange={(event) => setPhone(event.target.value)}
          aria-invalid={invalid}
          className={styles.field}
        />
        <button type="submit" className={styles.button}>
          {buttonLabel}
        </button>
      </div>
      <p className={invalid ? styles.error : styles.hint}>{invalid ? t("error") : t("hint")}</p>
    </form>
  );
}
