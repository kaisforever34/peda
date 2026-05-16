import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  // Force webpack to avoid Turbopack issues with Next.js 16 + middleware
  turbopack: {},
  
  serverExternalPackages: ["@prisma/client", "better-sqlite3", "@prisma/adapter-better-sqlite3"],
  
  reactStrictMode: true,
  
  experimental: {
    serverActions: {
      bodySizeLimit: "2mb",
    },
  },
};

export default nextConfig;
