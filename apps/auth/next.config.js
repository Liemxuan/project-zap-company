/** @type {import('next').NextConfig} */
const nextConfig = {
  images: {
    remotePatterns: [
      {
        protocol: 'https',
        hostname: 'ui-avatars.com',
      },
    ],
  },
  transpilePackages: ['zap-design', '@olympus/zap-auth', '@olympus/zap-db'],
  async rewrites() {
    return [
      {
        source: '/api/proxy/:path*',
        destination: `${process.env.NEXT_PUBLIC_API_URL || 'https://crm-gateway-v1-c7wqwyi1.uc.gateway.dev/api'}/:path*`,
      },
    ];
  },
};

module.exports = nextConfig;
