FROM node:20-alpine AS builder
WORKDIR /app

COPY package*.json ./
RUN npm ci

COPY . .

# Dùng npx thay vì nest trực tiếp
RUN npx nest build

FROM node:20-alpine
WORKDIR /app

COPY package*.json ./
RUN npm ci --only=production && npm cache clean --force

COPY --from=builder /app/dist ./dist

RUN mkdir -p uploads/jobs uploads/news

EXPOSE 3000
CMD ["node", "dist/main"]