/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: true,
  eslint: {
    ignoreDuringBuilds: true, // Desactiva ESLint durante el build
  },
};

export default nextConfig;
