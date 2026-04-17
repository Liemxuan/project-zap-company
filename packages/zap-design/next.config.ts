import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  output: 'standalone',
  transpilePackages: ['@excalidraw/excalidraw'],
  // experimental: {
  //   turbo: {
  //     root: '../../',
  //   },
  // },
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
      {
        protocol: 'https',
        hostname: 'cdn.pho24.com.vn',
      },
    ],
  },
  async rewrites() {
    const INVENTORY_API = process.env.NEXT_PUBLIC_INVENTORY_API_URL || 'http://localhost:3300';
    return [
      {
        source: '/api/inventory/:path*',
        destination: `${INVENTORY_API}/api/inventory/:path*`,
      },
      {
        source: '/webhook/:path*',
        destination: `${INVENTORY_API}/webhook/:path*`,
      },
      {
        source: '/api/proxy/crm-gateway/:path*',
        destination: 'https://crm-gateway-v1-9t9or3wt.uc.gateway.dev/api/:path*',
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
