/** @type {import('next').NextConfig} */
const nextConfig = {
  transpilePackages: ['zap-design'],
  async rewrites() {
    return [
      {
        source: '/mission-control',
        destination: 'http://localhost:3000/design/metro/mission-control'
      },
      {
        source: '/mission-control/:path*',
        destination: 'http://localhost:3000/design/metro/mission-control/:path*'
      },
      {
        source: '/_next/:path*',
        destination: 'http://localhost:3000/_next/:path*'
      },
      {
        source: '/api/:path*',
        destination: 'http://localhost:3000/api/:path*'
      }
    ];
  }
};

module.exports = nextConfig;
