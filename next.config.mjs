/** @type {import('next').NextConfig} */
const BACKEND_URL = process.env.BACKEND_URL;

const nextConfig = {
  output: 'standalone',
  serverExternalPackages: ['mongoose', 'bcryptjs'],
  images: {
    remotePatterns: [
      {
        protocol: 'https',
        hostname: 'res.cloudinary.com',
      },
      {
        protocol: 'https',
        hostname: 'images.unsplash.com',
      },
    ],
  },
  ...(BACKEND_URL
    ? {
        async rewrites() {
          return [
            {
              source: '/api/:path*',
              destination: `${BACKEND_URL}/api/:path*`,
            },
          ];
        },
      }
    : {}),
  webpack: (config) => {
    config.watchOptions = {
      ...config.watchOptions,
      ignored: ['**/.playwright-cli/**', '**/node_modules/**', '**/.git/**'],
    };
    return config;
  },
};

export default nextConfig;
