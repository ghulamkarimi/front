import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  images: {
    remotePatterns: [
      {
        protocol: "http",
        hostname: "localhost",
        port: "7001",
        pathname: "/images/carBuyImages/**",
      },
    ],
  },
};

export default nextConfig;
