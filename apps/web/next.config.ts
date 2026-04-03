import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  distDir: '.next-build',
  async redirects() {
    return [
      {
        source: '/design/:path*',
        destination: 'http://localhost:3010/design/:path*',
        permanent: false,
      },
    ];
  },
};

export default nextConfig;
