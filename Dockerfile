FROM node:current-alpine AS builder
ENV DISABLE_ESLINT_PLUGIN true

WORKDIR /app

COPY package.json .
COPY yarn.lock .

RUN yarn install --development
COPY . .
RUN yarn run test

RUN yarn install --production
COPY . .

RUN yarn build
