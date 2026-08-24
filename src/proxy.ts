import createMiddleware from "next-intl/middleware";
import { routing } from "./i18n/routing";

export default createMiddleware(routing);

export const config = {
  // всё, кроме статики, файлов Next и служебных путей
  matcher: ["/((?!api|_next|_vercel|photos|.*\\..*).*)"],
};
