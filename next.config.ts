import type {NextConfig} from 'next';

const nextConfig: NextConfig = {
  /* config options here */
  typescript: {
    ignoreBuildErrors: true,
  },
  eslint: {
    ignoreDuringBuilds: true,
  },
  images: {
    remotePatterns: [
      {
        protocol: 'https',
        hostname: 'placehold.co',
        port: '',
        pathname: '/**',
      },
    ],
  },
  experimental: {
    // This is required for Firebase Studio to work.
    allowedDevOrigins: ["https://6000-firebase-studio-1756053414198.cluster-lr6dwlc2lzbcctqhqorax5zmro.dev"],
  },
};

export default nextConfig;
