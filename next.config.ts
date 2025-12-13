import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  images: {
    remotePatterns: [
      {
        protocol: 'https',
        hostname: 'images.unsplash.com',
        port: '',
        pathname: '/**',
      },
      // Allow Supabase storage public URLs (storage objects)
      {
        protocol: 'https',
        hostname: 'zevyyvvgwaerxydtmiwh.supabase.co',
        port: '',
        pathname: '/storage/v1/object/public/**',
      },
      // Generic allowance for supabase-hosted assets (if you use multiple projects)
      {
        protocol: 'https',
        hostname: '**.supabase.co',
        port: '',
        pathname: '/**',
      },
    ],
  },
};

export default nextConfig;
