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
  // IMPORTANT: Replace 'your-repo-name' with the name of your GitHub repository.
  basePath: process.env.NODE_ENV === 'production' ? '/your-repo-name' : '',
  images: {
    unoptimized: true,
  },
};

module.exports = nextConfig;
