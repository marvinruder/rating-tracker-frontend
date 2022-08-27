FROM node:lts-alpine as test
ARG CODECOV_TOKEN

WORKDIR /app

COPY . .
RUN yarn install
RUN yarn test:ci

RUN apk add --no-cache git
RUN wget -O codecov -q https://uploader.codecov.io/latest/alpine/codecov
RUN chmod +x codecov
RUN ./codecov -s coverage -B $(git branch --show-current) -C $(git log -n 1 --pretty=format:'%H')

FROM node:lts-alpine as build
ENV NODE_ENV production

WORKDIR /app

COPY . .
RUN yarn workspaces focus --production
RUN yarn build


FROM alpine:3.16 as run

RUN apk add --no-cache lighttpd

COPY --from=build /app/dist /dist
COPY lighttpd.conf .
RUN mkdir /deflate_cache

CMD [ "lighttpd", "-D", "-f", "/lighttpd.conf" ]
