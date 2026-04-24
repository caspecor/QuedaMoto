import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  images: {
    remotePatterns: [
      {
        protocol: 'https',
        hostname: 'images.unsplash.com',
      },
    ],
  },
  // Disable Turbopack for Vercel build stability
  experimental: {
    turbo: false,
  },
  // Ensure proper output for Vercel
  output: 'standalone',
};

export default nextConfig;
