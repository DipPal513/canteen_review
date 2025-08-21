
import withPWA from 'next-pwa';

// The main Next.js configuration object.
const nextConfig = {
  // Add other Next.js configurations here as needed.
  reactStrictMode: true,
  swcMinify: true,
};

// Wrap the nextConfig with the withPWA plugin.
// This exports the combined configuration.
export default withPWA({
  ...nextConfig,
  pwa: {
    // The destination directory for the service worker file.
    dest: 'public',
    // In development, the PWA plugin is disabled by default.
    // Set this to true to enable it during development for testing.
    disable: process.env.NODE_ENV === 'development',
  },
});