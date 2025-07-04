/** @type {import('next').NextConfig} */
const nextConfig = {
  // Enable ESLint for better code quality
  eslint: {
    ignoreDuringBuilds: false,
  },
  // Enable TypeScript checking for better type safety
  typescript: {
    ignoreBuildErrors: false,
  },
  // Optimize images for better performance
  images: {
    unoptimized: false,
    domains: ["localhost"],
  },
  // Enable experimental features for better performance
  experimental: {
    optimizePackageImports: ["lucide-react", "@radix-ui/react-icons"],
  },
  // Compiler optimizations
  compiler: {
    removeConsole: process.env.NODE_ENV === "production",
  },
};

export default nextConfig;
