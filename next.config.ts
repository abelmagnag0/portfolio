import type { NextConfig } from 'next';

const nextConfig: NextConfig = {
  // Export estático para gerar a pasta 'out/' conforme PORTFOLIO_SETUP_DEPLOY.md
  output: 'export',
  // Evita warning de lockfiles em diretórios acima (monorepo, home etc.)
  outputFileTracingRoot: __dirname,
  images: {
    // Desativa otimização server-side para compatibilidade com export estático
    unoptimized: true,
  },
  experimental: {
    // Necessário porque o app tem múltiplos root layouts (route groups (pt)/(en)):
    // sem um layout único, o 404 global precisa renderizar seu próprio <html>.
    globalNotFound: true,
  },
};

export default nextConfig;
