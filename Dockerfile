# Ambiente local do portfólio (Next.js) em container.
# Sobe o dev server com hot reload para iterar em UI/UX.
FROM node:22-slim

RUN npm install -g pnpm@10.33.2

WORKDIR /app

# Camada de dependências separada para melhor cache de build.
# Concorrência menor + mais retries tornam o install resiliente a redes instáveis.
COPY package.json pnpm-lock.yaml ./
RUN pnpm install --frozen-lockfile \
  --network-concurrency=4 \
  --fetch-retries=5 \
  --fetch-retry-maxtimeout=120000

# Código da aplicação.
COPY . .

EXPOSE 3000

# -H 0.0.0.0 para aceitar conexões de fora do container.
CMD ["pnpm", "exec", "next", "dev", "-H", "0.0.0.0", "-p", "3000"]
