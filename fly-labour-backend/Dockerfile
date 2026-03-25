FROM node:20

WORKDIR /app

COPY package*.json ./

RUN npm install

RUN chmod +x node_modules/.bin/*

COPY . .

RUN npm run build

RUN mkdir -p uploads/jobs uploads/news

EXPOSE 3000

CMD ["node", "dist/main"]