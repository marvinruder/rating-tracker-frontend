FROM node:current-alpine
ENV NODE_ENV production

WORKDIR /app

COPY . .
RUN yarn install --production && yarn build && rm -r node_modules && yarn cache clean --all
RUN yarn install -g vite

CMD ["yarn", "serve"]
