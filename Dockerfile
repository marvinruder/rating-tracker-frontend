FROM node:lts-alpine as build
ENV NODE_ENV production

WORKDIR /app

COPY . .
RUN yarn workspaces focus --production --color=always
RUN yarn build --color=always


FROM alpine:3.16 as run

RUN apk add --no-cache lighttpd

COPY lighttpd.conf .
COPY --from=build /app/dist /dist
RUN mkdir /deflate_cache

CMD [ "lighttpd", "-D", "-f", "/lighttpd.conf" ]
