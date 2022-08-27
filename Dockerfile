FROM node:lts-alpine as test
ARG CODECOV_TOKEN

WORKDIR /app

COPY . .
COPY .git/ ./.git
RUN yarn install
RUN yarn test:ci

RUN wget -O codecov -q https://uploader.codecov.io/latest/alpine/codecov
RUN chmod +x codecov
RUN ./codecov -t ${CODECOV_TOKEN}

FROM node:lts-alpine as build
ENV NODE_ENV production

WORKDIR /app

COPY . .
RUN yarn workspaces focus --production
RUN yarn build


FROM alpine:3.16 as run

RUN apk update \
  && apk add lighttpd \
  && rm -rf /var/cache/apk/*

COPY --from=build /app/dist /dist
COPY lighttpd.conf .
RUN mkdir /deflate_cache

CMD [ "lighttpd", "-D", "-f", "/lighttpd.conf" ]
