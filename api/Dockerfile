FROM node:14.18.2-alpine

ADD dist /opt/build

ADD package.json /opt/build/api/package.json

ADD yarn.lock /opt/build/api/yarn.lock

WORKDIR /opt/build/api

RUN yarn install

CMD yarn start:prod:docker
