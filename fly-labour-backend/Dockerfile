FROM node:20-alpine AS builder
WORKDIR /app

COPY package*.json ./
RUN npm ci

COPY . .
COPY tsconfig.json ./

# Build bằng tsc thay vì nest build
RUN ./node_modules/.bin/tsc -p tsconfig.json

FROM node:20-alpine
WORKDIR /app

COPY package*.json ./
RUN npm ci --only=production && npm cache clean --force

COPY --from=builder /app/dist ./dist

RUN mkdir -p uploads/jobs uploads/news

EXPOSE 3000
CMD ["node", "dist/main"]