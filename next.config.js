/** @type {import('next').NextConfig} */
const nextConfig = {
  experimental: {
    turbo: false, // garante que o Turbopack não será usado na Vercel
  },
};

module.exports = nextConfig;
