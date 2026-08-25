import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  output: "export",
  basePath: "/verdant-smart-garden",
  trailingSlash: true,
  images: {
    unoptimized: true,
  },
  poweredByHeader: false,
};

export default nextConfig;
