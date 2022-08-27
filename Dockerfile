FROM node:lts-alpine as test
ARG CODECOV_TOKEN
ARG VCS_SLUG
ARG VCS_COMMIT_ID

WORKDIR /app

COPY . .
RUN yarn install
RUN yarn test:ci

RUN ls -l /app/.git/

RUN wget -O codecov -q https://uploader.codecov.io/latest/alpine/codecov
RUN chmod +x codecov
RUN ./codecov -R /app

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
