FROM node:9-alpine

# fix node-sass permission denied issue
RUN apk --no-cache add g++ gcc libgcc libstdc++ linux-headers make python
RUN yarn global add --quiet node-gyp

ADD package.json /tmp/package.json
ADD yarn.lock /tmp/yarn.lock
RUN cd /tmp && yarn install --freeze-lockfile && mkdir -p /app && cp -a /tmp/node_modules /app/

COPY . /app
WORKDIR /app

RUN yarn build:prod
ENTRYPOINT [ "node", "server" ]
