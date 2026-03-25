# --- Stage 1: Build ---
FROM node:20-alpine AS builder
WORKDIR /app

# Cài đặt công cụ build cho các thư viện native (nếu có)
RUN apk add --no-cache python3 make g++

COPY package*.json ./
# Cài đặt tất cả dependencies (cả dev để build được Nest)
RUN npm ci

COPY . .
# Build ra thư mục /dist
RUN npm run build

# --- Stage 2: Run ---
FROM node:20-alpine
WORKDIR /app

# Copy file package để npm biết các node_modules cần thiết
COPY --from=builder /app/package*.json ./
# Copy node_modules ĐÃ CÀI từ stage builder sang (nhanh và an toàn hơn)
COPY --from=builder /app/node_modules ./node_modules
# Copy code đã build
COPY --from=builder /app/dist ./dist

# Tạo các thư mục upload (nếu code của bạn lưu file local)
RUN mkdir -p uploads/jobs uploads/news

# LƯU Ý: Railway sẽ tự inject PORT, EXPOSE ở đây chỉ mang tính tài liệu
EXPOSE 3000

CMD ["node", "dist/main"]