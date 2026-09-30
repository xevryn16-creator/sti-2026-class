import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  // STI 2026 is a fully static, read-only publication (ARCHITECTURE.md §9).
  // Standard Vercel SSG build — no runtime secrets, no server data fetching.
  images: {
    formats: ["image/avif", "image/webp"],
  },
};

export default nextConfig;
