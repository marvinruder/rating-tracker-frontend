FROM node:current-alpine
ENV NODE_ENV production

WORKDIR /app

COPY package.json .
COPY yarn.lock .

RUN yarn install --production

COPY . .

RUN yarn build

CMD ["yarn", "serve"]
