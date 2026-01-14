// next.config.ts
import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  images: {
    remotePatterns: [
      {
        protocol: 'https',
        hostname: 'images.unsplash.com',
        pathname: '/**',
      },
    ],
    // THÊM CÁC CẤU HÌNH NÀY
    formats: ['image/avif', 'image/webp'], // Hỗ trợ định dạng hiện đại
    deviceSizes: [640, 750, 828, 1080, 1200, 1920, 2048, 3840], // Kích thước device
    imageSizes: [16, 32, 48, 64, 96, 128, 256, 384], // Kích thước ảnh
    minimumCacheTTL: 60, // Cache tối thiểu 60 giây
  },
  // THÊM CẤU HÌNH NÀY NỮA
  experimental: {
    optimizeCss: true, // Tối ưu CSS
  },
  // BẬT COMPRESSION
  compress: true,
};

export default nextConfig;