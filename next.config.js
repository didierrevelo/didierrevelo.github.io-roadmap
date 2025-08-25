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
  // IMPORTANT: Replace 'didierrevelo.github.io-roadmap' with the name of your GitHub repository.
  assetPrefix: process.env.NODE_ENV === 'production' ? '/didierrevelo.github.io-roadmap' : undefined,
  basePath: process.env.NODE_ENV === 'production' ? '/didierrevelo.github.io-roadmap' : undefined,
  images: {
    unoptimized: true,
  },
};

module.exports = nextConfig;
