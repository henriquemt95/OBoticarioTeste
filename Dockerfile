FROM node:14-alpine3.14 AS builder
WORKDIR /usr/src/app
COPY ./package*.json ./
RUN npm i
COPY . .
RUN rm -rf .env
RUN npx prisma generate
RUN npm run build


FROM builder AS integration-tests
WORKDIR /usr/src/app
COPY --from=builder /usr/src/app .
EXPOSE 8080
CMD ["sh", "./test/start-unit-test-dockerfile.sh"]

FROM builder AS development
WORKDIR /usr/src/app
COPY --from=builder /usr/src/app .
EXPOSE 8080
CMD ["sh", "./start-development-dockerfile.sh"]