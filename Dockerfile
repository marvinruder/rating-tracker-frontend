FROM node:current-alpine
ENV NODE_ENV production

WORKDIR /app

COPY . .
RUN yarn install --production && yarn build && rm -r node_modules

CMD ["yarn", "serve"]
