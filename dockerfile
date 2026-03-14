# Production stage
FROM node:20-alpine AS runner

WORKDIR /app

RUN apk add --no-cache wget

COPY --from=builder /app/dist ./dist

EXPOSE 3000

ENV HOST=0.0.0.0
ENV PORT=3000

CMD ["node", "./dist/server/entry.mjs"]
