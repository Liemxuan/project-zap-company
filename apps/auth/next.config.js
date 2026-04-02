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
};

module.exports = nextConfig;
