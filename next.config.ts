import type { NextConfig } from "next";
import createNextIntlPlugin from "next-intl/plugin";

const withNextIntl = createNextIntlPlugin();

const nextConfig: NextConfig = {
  // Картинки отдаём уже готовыми вариантами AVIF/WebP из public/photos:
  // рантайм-оптимизация хостинга нам не нужна и не тарифицируется.
  images: { unoptimized: true },
  // Плашка dev-режима садится ровно на липкую панель действий
  devIndicators: false,
};

export default withNextIntl(nextConfig);
