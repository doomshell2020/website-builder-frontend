import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  reactStrictMode: false, // true for production to catch bugs fast
  devIndicators: false,
  images: {
    // domains: ["newstaging.doomshell.com"],
    // domains: ["webbuilder.local"],
    domains: ["192.168.0.77"],
  },
};

export default nextConfig;