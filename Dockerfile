FROM node:current-alpine
ENV DISABLE_ESLINT_PLUGIN true

WORKDIR /app

COPY package.json .
COPY yarn.lock .

RUN yarn install
COPY . .
RUN yarn run test:ci

RUN yarn install --production
RUN yarn build

RUN yarn global add serve

CMD ["serve", "-s", "build"]
