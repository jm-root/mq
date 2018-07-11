FROM jamma/node
MAINTAINER Jeff YU, jeff@jamma.cn
COPY . .
RUN apk add --update \
    python \
  && rm -rf /var/cache/apk/*
RUN npm install --production && npm cache clean --force