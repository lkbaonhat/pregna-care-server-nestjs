FROM node:18-alpine AS builder

WORKDIR /app

COPY package*.json ./

RUN npm install
RUN npm install @css-inline/css-inline-linux-x64-musl

COPY . .

EXPOSE 8080

CMD ["npm", "run", "start:dev"]
