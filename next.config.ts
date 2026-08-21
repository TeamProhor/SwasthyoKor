import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  allowedDevOrigins: ["79.143.185.101"],
  reactCompiler: true,
  images: {
    formats: ["image/avif", "image/webp"],
    remotePatterns: [
      {
        protocol: "https",
        hostname: "picsum.photos",
      },
    ],
  },
};

export default nextConfig;
