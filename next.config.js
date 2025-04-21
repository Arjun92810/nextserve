/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: true,
  transpilePackages: ['leaflet', 'react-leaflet'],
  images: {
    domains: ['maps.googleapis.com', 'lh3.googleusercontent.com'],
  },
};

module.exports = nextConfig; 