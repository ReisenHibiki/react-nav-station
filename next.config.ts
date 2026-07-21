import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  /* config options here */
  images: {
  remotePatterns: [
    {
      protocol: "https",
      hostname: "*.supabase.co",
    },
    {
      protocol: 'http',
      hostname: 'api.rms.net.cn',
      port: '',
      pathname: '/**',
    },
  ],
  }
};

export default nextConfig;
