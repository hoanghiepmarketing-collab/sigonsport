/** @type {import('next').NextConfig} */
const nextConfig = {
  images: {
    remotePatterns: [
      {
        protocol: 'https',
        hostname: 'placehold.co',
      },
      {
        protocol: 'https',
        hostname: '*.supabase.co',
      },
    ],
  },
  // Cho phép import CSS từ thư mục css/ hiện có
  webpack: (config) => {
    return config;
  },
};

module.exports = nextConfig;
