/** @type {import('next').NextConfig} */
const nextConfig = {
  swcMinify: false,
  images: {
    remotePatterns: [{ protocol: 'https', hostname: '**' }]
  }
};
module.exports = nextConfig;
