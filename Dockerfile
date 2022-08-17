FROM node:current-alpine
ENV NODE_ENV production

WORKDIR /app

COPY package.json .
COPY yarn.lock .

RUN yarn install --production
RUN yarn build

CMD ["yarn", "serve"]
