const withPWA = require('next-pwa')({
  dest: 'public',
  disable: process.env.NODE_ENV === 'development',
});

// The main Next.js configuration object.
const nextConfig = {
  reactStrictMode: true,
  swcMinify: true,
  // Add other Next.js configurations here as needed.
};

// This exports the combined configuration.
module.exports = withPWA(nextConfig);