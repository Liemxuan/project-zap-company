import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  transpilePackages: ['@excalidraw/excalidraw'],
  experimental: {
    turbo: {
      root: '../../',
    },
  },
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
      // Forward legacy URLs to the new M3 dynamic theme router
      {
        source: '/mission-control',
        destination: '/design/metro/mission-control',
        permanent: true,
      },
      {
        source: '/mission-control/:path*',
        destination: '/design/metro/mission-control/:path*',
        permanent: true,
      }
    ];
  },
};

export default nextConfig;
