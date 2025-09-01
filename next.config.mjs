// next.config.mjs
/** @type {import('next').NextConfig} */

// CSP básica (ajuste se usar mapas, workers, etc.)
const csp = `
  default-src 'self';
  script-src 'self' 'unsafe-inline' 'unsafe-eval' blob:;
  style-src 'self' 'unsafe-inline';
  img-src 'self' data: blob: https://images.unsplash.com https://*.vercel.app;
  font-src 'self' data:;
  connect-src 'self' https://broker.emqx.io wss://broker.emqx.io https://api.resend.com;
  frame-ancestors 'self';
  object-src 'none';
  base-uri 'self';
`.replace(/\s{2,}/g, ' ').trim();

const securityHeaders = [
  { key: 'Content-Security-Policy', value: csp },
  { key: 'Referrer-Policy', value: 'strict-origin-when-cross-origin' },
  { key: 'X-Content-Type-Options', value: 'nosniff' },
  { key: 'X-Frame-Options', value: 'SAMEORIGIN' },
  { key: 'Permissions-Policy', value: 'camera=(), microphone=(), geolocation=()' },
];

if (process.env.NODE_ENV === 'production') {
  securityHeaders.push({
    key: 'Strict-Transport-Security',
    value: 'max-age=63072000; includeSubDomains; preload', // 2 anos
  });
}

const nextConfig = {
  reactStrictMode: true,

  images: {
    remotePatterns: [
      { protocol: 'https', hostname: 'images.unsplash.com' },
      // adicione domínios de CDN que você usar
      // { protocol: 'https', hostname: 'cdn.seudominio.com' },
    ],
  },

  experimental: {
    optimizePackageImports: [
      'react',
      'react-dom',
      'framer-motion',
      'lucide-react',
    ],
  },

  async headers() {
    return [
      {
        source: '/:path*',
        headers: securityHeaders,
      },
    ];
  },
};

export default nextConfig;
