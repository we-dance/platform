FROM node:lts-alpine

WORKDIR /app

COPY package.json ./
COPY yarn.lock ./

RUN yarn install --network-timeout 1000000

EXPOSE 3000

CMD ["yarn", "dev"]
