FROM node:20.11.1-alpine

RUN npm install -g pnpm

WORKDIR /home/node/app

COPY package.json ./
COPY prisma ./prisma/

RUN pnpm install

COPY . .

RUN pnpm dlx prisma generate

RUN pnpm run build

