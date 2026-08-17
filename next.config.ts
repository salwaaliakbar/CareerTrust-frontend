import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  // Performance optimizations
  experimental: {
    // Enable optimized package imports to reduce bundle size
    optimizePackageImports: ["lucide-react"],
  },
  // Ensure Turbopack uses this project root (prevents picking parent lockfiles)
  turbopack: {
    root: __dirname,
  },

  // Reduce compilation time
  typescript: {
    // Only type-check on build, not during dev
    ignoreBuildErrors: false,
  },

  // Optimize images
  images: {
    remotePatterns: [
      {
        protocol: "https",
        hostname: "res.cloudinary.com",
        pathname: "/**",
      },
      {
        protocol: "https",
        hostname: "i.pravatar.cc",
        pathname: "/**",
      },
    ],
  },

  async headers() {
    return [
      {
        source: "/(.*)",
        headers: [
          { key: "X-Frame-Options", value: "SAMEORIGIN" },
          { key: "X-Content-Type-Options", value: "nosniff" },
          { key: "Referrer-Policy", value: "strict-origin-when-cross-origin" },
        ],
      },
    ];
  },

  // Webpack optimizations (fallback when not using turbopack)
  webpack: (config, { dev, isServer }) => {
    if (dev && !isServer) {
      // Reduce the number of modules that need to be processed
      config.watchOptions = {
        ignored: ["**/node_modules/**", "**/.git/**", "**/.next/**"],
        poll: false,
      };
    }
    return config;
  },
};

export default nextConfig;
