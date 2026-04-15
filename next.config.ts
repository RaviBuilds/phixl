import type { NextConfig } from "next";
import { hostname } from "os";

/** @type {import('next').NextConfig} */
const nextConfig = {
  output: "standalone",
  images: {
    remotePatterns: [
      {
        protocol: "https",
        hostname: "oztifmelmrkrnfwbjjtf.supabase.co",
        port:"",
        pathname:"/storage/v1/object/public/**"
      },
    ],
  },
};

export default nextConfig;
