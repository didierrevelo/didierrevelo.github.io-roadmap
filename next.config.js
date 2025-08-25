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
  // Add the following configuration for GitHub Pages
  output: 'export',
  // IMPORTANT: Replace 'cybersecurity-roadmap-navigator' with the name of your GitHub repository.
  basePath: process.env.NODE_ENV === 'production' ? '/cybersecurity-roadmap-navigator' : '',
  images: {
    unoptimized: true,
  },
};

module.exports = nextConfig;
