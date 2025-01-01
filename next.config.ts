import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  productionBrowserSourceMaps: true,
  images: {
    remotePatterns: [
      {
        protocol: "https",
        hostname: "car-db.aundoautoservice.de", 
        pathname: "/images/carBuyImages/**",
      },
      {
        protocol: "https",
        hostname: "car-db.aundoautoservice.de", 
        pathname: "/images/offerImages/**",
      },
      {
        protocol: "https",
        hostname: "car-db.aundoautoservice.de", 
        pathname: "/images/userImages/**",
      },
      {
        protocol: "https",
        hostname: "car-db.aundoautoservice.de", 
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
