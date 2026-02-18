import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  images: {
    remotePatterns: [
      { protocol: "https", hostname: "ssl.gstatic.com" },
      { protocol: "https", hostname: "lh3.google.com" },
    ],
  },
};

export default nextConfig;
