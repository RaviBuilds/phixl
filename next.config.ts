import type { NextConfig } from "next";

/** @type {import('next').NextConfig} */
const nextConfig = {
  output: "standalone",
  images: {
    // 🚀 ADDED THIS LINE FOR LIGHTHOUSE LCP OPTIMIZATION
    formats: ["image/avif", "image/webp"],
    remotePatterns: [
      {
        protocol: "https",
        hostname: "oztifmelmrkrnfwbjjtf.supabase.co",
        port: "",
        pathname: "/storage/v1/object/public/**",
      },
    ],
  },
};

export default nextConfig;
