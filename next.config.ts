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
      {
        protocol: "http",
        hostname: "localhost",
        port: "7001",
        pathname: "/images/offerImages/**",
      },
      {
        protocol: "http",
        hostname: "localhost",
        port: "7001",
        pathname: "/images/userImages/**",
      },
      {
        protocol: "http",
        hostname: "localhost",
        port: "7001",
        pathname: "/images/carRentImages/**",
      },
      {
        protocol: "https",
        hostname: "www.pngplay.com",
        pathname: "/**",
      },
    ],
  },
};

export default nextConfig;
