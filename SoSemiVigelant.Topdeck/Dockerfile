FROM node:alpine

ADD package.json /tmp/package.json
ADD yarn.lock /tmp/yarn.lock
RUN cd /tmp && yarn install --freeze-lockfile && mkdir -p /app && cp -a /tmp/node_modules /app/

COPY . /app
WORKDIR /app
RUN yarn install --freeze-lockfile
ENTRYPOINT [ "yarn", "run", "start"]