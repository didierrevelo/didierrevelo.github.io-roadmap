/**
 * @type {import('next').NextConfig}
 */
const nextConfig = {
  /* config options here */
  typescript: {
    ignoreBuildErrors: true,
  },
  eslint: {
    ignoreDuringBuilds: true,
  },
  output: 'export',
  // Add the following configuration for GitHub Pages
  // IMPORTANT: Replace 'roadmap' with the name of your GitHub repository if it's different.
  assetPrefix: process.env.NODE_ENV === 'production' ? '/roadmap' : undefined,
  basePath: process.env.NODE_ENV === 'production' ? '/roadmap' : undefined,
  images: {
    unoptimized: true,
  },
};

module.exports = nextConfig;
