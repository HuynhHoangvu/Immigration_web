FROM node:20-alpine AS builder
WORKDIR /app
RUN apk add --no-cache python3 make g++
COPY package*.json ./
RUN npm ci
COPY . .
COPY tsconfig.json ./
RUN node node_modules/@nestjs/cli/bin/nest.js build

FROM node:20-alpine
WORKDIR /app
COPY package*.json ./
RUN npm ci --only=production && npm cache clean --force
COPY --from=builder /app/dist ./dist
RUN mkdir -p uploads/jobs uploads/news uploads/cv

# Tạo entrypoint với proper Unix line endings (LF)
RUN printf '#!/bin/sh\n' > /entrypoint.sh && \
    printf 'echo "=== Starting migration ==="\n' >> /entrypoint.sh && \
    printf 'node dist/database/migrate.js\n' >> /entrypoint.sh && \
    printf 'echo "=== Starting app ==="\n' >> /entrypoint.sh && \
    printf 'exec node dist/main\n' >> /entrypoint.sh && \
    chmod +x /entrypoint.sh

EXPOSE 3000
CMD ["/entrypoint.sh"]
