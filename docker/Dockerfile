FROM node:14.16.0-alpine

ENV NODE_ENV=production

RUN wget -qO - https://download.docker.com/linux/static/stable/x86_64/docker-20.10.4.tgz \
    | tar xz -C /usr/local/bin/ --strip-components=1 docker/docker

WORKDIR /home/node/app

COPY package*.json /home/node/app/
RUN npm i

COPY src src
COPY config/production.js config/

ENTRYPOINT ["npm", "start"]
