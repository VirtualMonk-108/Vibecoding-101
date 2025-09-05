/** @type {import('next').NextConfig} */
const nextConfig = {
  transpilePackages: ['@eventza/shared', '@eventza/firebase'],
  images: {
    domains: ['localhost', 'firebasestorage.googleapis.com', 'images.unsplash.com'],
  },
  env: {
    CUSTOM_KEY: process.env.CUSTOM_KEY,
  },
}

module.exports = nextConfig