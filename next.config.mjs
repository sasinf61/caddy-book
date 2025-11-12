/** @type {import('next').NextConfig} */
const nextConfig = {
  experimental: {
    turbopack: {
      // This fixes the "inferred your workspace root" warning.
      root: process.cwd(),
    }
  },
  images: {
    remotePatterns: [
      {
        protocol: 'https',
        hostname: 'picsum.photos',
      },
      {
        protocol: 'https',
        hostname: 'cdn.jsdelivr.net',
      },
      {
        protocol: 'https',
        hostname: 'avatars.githubusercontent.com',
      },
    ],
  },
};

export default nextConfig;
