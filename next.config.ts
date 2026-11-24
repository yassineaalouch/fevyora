import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  // Cloudflare Pages sert un dossier statique. `out` est le dossier qu'il cherche.
  output: "export",
  trailingSlash: true,
  images: {
    // Les fichiers sont déjà compressés. L'optimiseur les ré-encodeait et les rendait flous.
    unoptimized: true,
  },
  turbopack: {
    rules: {
      "*.css": {
        loaders: ["@tailwindcss/turbopack"],
        as: "*.css",
      },
    },
  },
};

export default nextConfig;
