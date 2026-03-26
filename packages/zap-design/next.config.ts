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
  async redirects() {
    return [
      {
        source: '/metro',
        destination: '/design/metro',
        permanent: false,
      },
      {
        source: '/metro/:path*',
        destination: '/design/metro/:path*',
        permanent: false,
      },
      // Escape trap for browsers stuck on the previous invalid redirect
      {
        source: '/design/metro/mission-control',
        destination: '/mission-control',
        permanent: false,
      }
    ];
  },
};

export default nextConfig;
