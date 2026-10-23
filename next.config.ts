import type { NextConfig } from 'next';

const nextConfig = {
  reactStrictMode: false,
  poweredByHeader: false,
  // Let middleware combine casing, host and slash changes into one redirect.
  skipTrailingSlashRedirect: true,
  // Keep canonical tags in <head>, including for crawlers that do not run JS.
  htmlLimitedBots: /.*/,
  output: 'standalone',
  eslint: {
    ignoreDuringBuilds: true,
  },
  images: {
    qualities: [75, 100],
    remotePatterns: [
      {
        protocol: 'https',
        hostname: 'd2lptvt2jijg6f.cloudfront.net',
      },
      {
        protocol: 'https',
        hostname: 'i3.ytimg.com',
      },
      {
        protocol: 'https',
        hostname: 'www.youtube.com',
      },
      {
        protocol: 'https',
        hostname: 'd3vvmt2ub6odwk.cloudfront.net',
      },
      {
        protocol: 'https',
        hostname: 'jindalfoundation.in',
      },
    ],
  },
} satisfies NextConfig;

export default nextConfig;
