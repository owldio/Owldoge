import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  images: {
    unoptimized: false,
    formats: ['image/webp', 'image/avif'],
    deviceSizes: [640, 750, 828, 1080, 1200, 1920],
    imageSizes: [16, 32, 48, 64, 96, 128, 256, 384],
    qualities: [70, 75, 78, 80],
    // Optimized variants stay cached for 31 days instead of the 60s default,
    // so repeat visitors stop re-triggering expensive re-optimisation.
    minimumCacheTTL: 2678400,
  },
  turbopack: {
    root: __dirname,
  }
};

export default nextConfig;
