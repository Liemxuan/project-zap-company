import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  transpilePackages: ['@excalidraw/excalidraw'],
  images: {
    remotePatterns: [
      {
        protocol: 'https',
        hostname: 'i.pravatar.cc',
      },
      {
        protocol: 'https',
        hostname: 'images.unsplash.com',
      },
      {
        protocol: 'https',
        hostname: 'ui-avatars.com',
      },
    ],
  },
  async rewrites() {
    return [
      {
        source: '/api/inventory/:path*',
        destination: 'http://localhost:3300/api/inventory/:path*',
      },
      {
        source: '/webhook/:path*',
        destination: 'http://localhost:3300/webhook/:path*',
      }
    ];
  },
};

export default nextConfig;
