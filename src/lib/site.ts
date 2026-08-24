/**
 * Адрес сайта для канонических ссылок и карты сайта.
 * Домен ещё не куплен, поэтому берём его из переменной окружения:
 * на Vercel задать NEXT_PUBLIC_SITE_URL, локально работает адрес dev-сервера.
 */
export const siteUrl = (process.env.NEXT_PUBLIC_SITE_URL ?? "http://localhost:3000").replace(
  /\/$/,
  "",
);
