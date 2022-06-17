FROM node:17.6-alpine AS builder
WORKDIR /usr/src/app
COPY ./package*.json ./
RUN npm ci
COPY . .
RUN rm -rf .env
RUN npx prisma generate
RUN npm run build

FROM builder AS integration-tests
WORKDIR /usr/src/app
COPY --from=builder /usr/src/app .
EXPOSE 8080
CMD ["sh", "./test/start-integration-tests-dockerfile.sh"]

FROM builder AS development
WORKDIR /usr/src/app
COPY --from=builder /usr/src/app .
EXPOSE 8080
CMD ["npm", "run", "start:dev"]

FROM builder AS production
WORKDIR /usr/src/app
COPY --from=builder /usr/src/app .
EXPOSE 8080
CMD ["npm", "run", "start:prod"]
