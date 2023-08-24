FROM node:18

WORKDIR /backend/fastify/testapp

COPY . .

COPY .env .

RUN npm install

RUN npm run build

RUN npm run migrate:prod

EXPOSE 8080

CMD [ "npm", "start" ]

