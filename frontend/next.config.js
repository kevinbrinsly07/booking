/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: true,
  // Remove output: 'standalone' for Render compatibility
  env: {
    API_URL: process.env.NEXT_PUBLIC_API_URL || 'http://localhost:3001/api',
  },
  images: {
    domains: ['localhost', 'onrender.com'],
    remotePatterns: [
      {
        protocol: 'https',
        hostname: '*.onrender.com',
      },
    ],
  },
}

module.exports = nextConfig
