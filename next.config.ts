// next.config.ts
import type { NextConfig } from "next";

const imageDomains =
  process.env.BUILD_TARGET === 'development'
    ? ['localhost', '127.0.0.1']
    : [process.env.NEXT_PUBLIC_IMAGE_URL || 'baaraat.com'];

const nextConfig: NextConfig = {
  reactStrictMode: false,
  devIndicators: false,
  images: {
    domains: imageDomains,
  },
  typescript: {
    ignoreBuildErrors: true,
  },
  eslint: {
    ignoreDuringBuilds: true,
  },
};

export default nextConfig;

// import type { NextConfig } from "next";

// const nextConfig: NextConfig = {
//   reactStrictMode: false, // true for production to catch bugs fast
//   devIndicators: false,
//   images: {
//     // domains: ["newstaging.doomshell.com"],
//     // domains: ["webbuilder.local"],
//     domains: ["192.168.0.77"],
//   },
// };

// export default nextConfig;