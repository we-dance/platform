FROM node:14-alpine
RUN apk add --no-cache python3 py3-pip make g++

WORKDIR /app

COPY package.json ./
COPY yarn.lock ./

RUN yarn install --network-timeout 1000000

EXPOSE 3000

CMD ["yarn", "dev"]
