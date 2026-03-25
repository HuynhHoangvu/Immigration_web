FROM node:20-alpine AS builder
WORKDIR /app

# Fix permission issue trên Alpine
RUN apk add --no-cache python3 make g++

COPY package*.json ./
RUN npm ci

COPY . .
COPY tsconfig.json ./

# Dùng node trực tiếp thay vì ./bin/
RUN node node_modules/@nestjs/cli/bin/nest.js build

FROM node:20-alpine
WORKDIR /app

COPY package*.json ./
RUN npm ci --only=production && npm cache clean --force

COPY --from=builder /app/dist ./dist

RUN mkdir -p uploads/jobs uploads/news

EXPOSE 3000
CMD ["node", "dist/main"]