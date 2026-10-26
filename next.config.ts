import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  // Tailwind CSS v4 se compila con el loader oficial de Turbopack.
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
