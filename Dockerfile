FROM node:current-alpine
ENV NODE_ENV production

WORKDIR /app

COPY . .
RUN yarn install --production && yarn build && rm -r node_modules && yarn cache clean --all
RUN yarn global add vite

CMD ["yarn", "serve"]
