FROM node:current-alpine AS builder
ENV NODE_ENV production
ENV DISABLE_ESLINT_PLUGIN true

WORKDIR /app

COPY package.json .
COPY yarn.lock .

RUN yarn install --production

COPY . .

RUN yarn build
