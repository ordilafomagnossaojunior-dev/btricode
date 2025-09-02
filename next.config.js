// next.config.js
/** @type {import('next').NextConfig} */
const nextConfig = {
  // Mantém os avisos úteis no dev
  reactStrictMode: true,
  // NÃO habilite experimental.turbo (isso gera aquele warning “Expected object, received boolean”)
  experimental: {
    // Mantém o carregamento mais rápido de libs grandes
    optimizePackageImports: ['lucide-react', 'framer-motion', 'react-parallax-tilt'],
  },
  // Se você quiser que o build pare quando houver erros de lint, deixe como false
  eslint: { ignoreDuringBuilds: false },
  // Se quiser que o build falhe com erros de TS, deixe false
  typescript: { ignoreBuildErrors: false },

  // Opcional: se for usar imagens externas
  // images: {
  //   remotePatterns: [
  //     { protocol: 'https', hostname: 'images.unsplash.com' },
  //   ],
  // },

  // Pequenas otimizações
  poweredByHeader: false,
  compress: true,
};

export default nextConfig;
