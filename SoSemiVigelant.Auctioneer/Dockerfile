FROM node:alpine

ADD ./src/package.json /tmp/package.json
ADD ./src/yarn.lock /tmp/yarn.lock
RUN cd /tmp && yarn install --freeze-lockfile && mkdir -p /app && cp -a /tmp/node_modules /app/

COPY ./src /app
WORKDIR /app
RUN yarn install --freeze-lockfile
ENTRYPOINT [ "yarn", "run", "start", "-p=8000" ]