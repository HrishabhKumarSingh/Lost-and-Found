/** @type {import('next').NextConfig} */
const nextConfig = {
  images: {
    remotePatterns: [
      {
        protocol: 'https',
        hostname: 'lost-and-found-system.s3.amazonaws.com',
      },
    ],
  },
};

module.exports = nextConfig;
