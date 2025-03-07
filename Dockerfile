FROM node:20.12.2-alpine as dependencies
WORKDIR /app

COPY ./package.json ./
RUN env | grep APP_ > ./.env

RUN npm install

COPY . .
RUN npm run build

FROM node:20.12.2-alpine
WORKDIR /app
COPY --from=dependencies /app/public ./public
COPY --from=dependencies /app/build/dist ./public/dist
COPY --from=dependencies /app/build/index.js ./index.js

CMD ["node", "index.js"]