import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  // Gera um site estático (pasta "out/") que pode ser publicado na Vercel, GitHub Pages etc.
  output: "export",
  trailingSlash: true,
  images: { unoptimized: true },
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
