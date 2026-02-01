import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  // Configure external packages for server components
  serverExternalPackages: ["@aws-sdk/client-dynamodb", "@aws-sdk/lib-dynamodb"],
  
  // Configure image optimization for Amplify
  images: {
    unoptimized: false,
    remotePatterns: [
      {
        protocol: "https",
        hostname: "**",
      },
    ],
  },
  
  // Configure headers for better performance
  async headers() {
    return [
      {
        source: "/_next/static/:path*",
        headers: [
          {
            key: "Cache-Control",
            value: "public, max-age=31536000, immutable",
          },
        ],
      },
    ];
  },
  
  // Disable x-powered-by header for security
  poweredByHeader: false,
  
  // Enable compression
  compress: true,
  
  // Configure TypeScript
  typescript: {
    ignoreBuildErrors: false,
  },
  
  // Empty Turbopack config to silence warnings
  turbopack: {},
};

export default nextConfig;
