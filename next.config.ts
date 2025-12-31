import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  // Performance optimizations
  experimental: {
    // Enable optimized package imports to reduce bundle size
    optimizePackageImports: ['lucide-react', '@tensorflow/tfjs', 'face-api.js'],
  },
  
  // Reduce compilation time
  typescript: {
    // Only type-check on build, not during dev
    ignoreBuildErrors: false,
  },
  
  // Optimize images
  images: {
    remotePatterns: [],
    dangerouslyAllowSVG: true,
  },

  // Webpack optimizations (fallback when not using turbopack)
  webpack: (config, { dev, isServer }) => {
    if (dev && !isServer) {
      // Reduce the number of modules that need to be processed
      config.watchOptions = {
        ignored: ['**/node_modules/**', '**/.git/**', '**/.next/**'],
        poll: false,
      };
    }
    return config;
  },
};

export default nextConfig;
