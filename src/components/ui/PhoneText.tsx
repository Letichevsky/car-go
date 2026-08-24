import { contacts } from "@/lib/contacts";

/**
 * Номер телефона одним куском.
 * Знак «+» в Plus Jakarta Sans сидит заметно ниже середины цифр — приподнимаем его,
 * иначе в строке он выглядит провалившимся. Цифры моноширинные, чтобы номер не «дышал».
 */
export function PhoneText({ className = "" }: { className?: string }) {
  const [plus, ...rest] = contacts.phone;

  return (
    <span className={`inline-flex items-center tabular-nums ${className}`}>
      <span aria-hidden className="relative top-[-0.06em]">
        {plus}
      </span>
      {rest.join("")}
    </span>
  );
}
