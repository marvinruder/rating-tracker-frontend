FROM node:current-alpine
ENV NODE_ENV production

WORKDIR /app

COPY . .
RUN yarn install --production
RUN yarn build

RUN yarn cache clean --all
RUN yarn global add serve

CMD ["yarn", "serve"]
