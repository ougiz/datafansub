# Build stage
FROM node:20-alpine AS builder

ARG PUBLIC_API_URL
ENV PUBLIC_API_URL=${PUBLIC_API_URL}

WORKDIR /app

COPY package.json pnpm-lock.yaml ./

RUN corepack enable && corepack prepare pnpm@latest --activate

COPY . .

RUN pnpm install --frozen-lockfile && pnpm run build

# Production stage
FROM node:20-alpine AS runner

ARG PUBLIC_API_URL
ENV PUBLIC_API_URL=${PUBLIC_API_URL}

WORKDIR /app

RUN apk add --no-cache wget

COPY --from=builder /app/dist ./dist

EXPOSE 3000

ENV HOST=0.0.0.0
ENV PORT=3000

CMD ["node", "./dist/server/entry.mjs"]
