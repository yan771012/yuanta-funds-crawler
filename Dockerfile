FROM node:latest

COPY package.json /tmp/package.json

RUN mkdir -p /opt/app/dist && mv /tmp/package.json /opt/app \
&& cd /opt/app && npm install --production

WORKDIR /opt/app
ADD ./dist /opt/app/dist

CMD ["node", "dist/index.js"]
