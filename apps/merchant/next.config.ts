import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  transpilePackages: ['@olympus/zap-auth', '@olympus/zap-db', 'zap-design'],
  /* config options here */
};

export default nextConfig;
