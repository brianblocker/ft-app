import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  /* config options here */
  async rewrites() {
    return [
      {
        source: '/coingecko/:path*',
        destination: 'https://api.coingecko.com/api/v3/:path*',
      },
    ]
  },
};
export default nextConfig;
