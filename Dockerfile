# Dockerfile
FROM ghcr.io/puppeteer/puppeteer:21.5.2


ENV PUPPETEER_SKIP_DOWNLOAD=true


EXPOSE 1449


WORKDIR /app

COPY package*.json ./


RUN chown -Rh $user:$user /app
USER $user

COPY package*.json ./

RUN npm install


COPY . .

CMD [ "node", "index.js" ]
