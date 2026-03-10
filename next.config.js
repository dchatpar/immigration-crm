/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: true,
  swcMinify: true,
  images: {
    domains: ['localhost'],
  },
  webpack: (config, { isServer }) => {
    // Handle convex/_generated imports
    config.resolve.alias['convex/_generated'] = require('path').resolve(
      __dirname,
      'convex/_generated'
    );
    return config;
  },
}

module.exports = nextConfig