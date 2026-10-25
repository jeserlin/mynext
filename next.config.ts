import type { NextConfig } from 'next';

const nextConfig: NextConfig = {
  images: {
    remotePatterns: [
      {
        protocol: 'https',
        hostname: 'media.publit.io',
      },
      {
        protocol: 'https',
        hostname: 'webcdn2.ebook.hyread.com.tw',
      },
    ],
  },
};

export default nextConfig;
