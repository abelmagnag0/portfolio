import type { NextConfig } from 'next';

const nextConfig: NextConfig = {
  // Export estático para gerar a pasta 'out/' conforme PORTFOLIO_SETUP_DEPLOY.md
  output: 'export',
  // Evita warning de lockfiles em diretórios acima (monorepo, home etc.)
  outputFileTracingRoot: __dirname,
};

export default nextConfig;
