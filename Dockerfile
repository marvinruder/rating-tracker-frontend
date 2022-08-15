FROM node:current-alpine AS development
ENV NODE_ENV development

WORKDIR /app

COPY package.json .
COPY yarn.lock .
RUN yarn install

COPY . .

EXPOSE 3000

CMD [ "yarn", "run", "start" ]


FROM node:current-alpine AS builder
ENV NODE_ENV production
ENV DISABLE_ESLINT_PLUGIN true

WORKDIR /app

COPY package.json .
COPY yarn.lock .

RUN yarn install --production

COPY . .

RUN yarn build
