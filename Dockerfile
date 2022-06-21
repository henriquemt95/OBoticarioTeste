FROM node:17.6-alpine AS builder
WORKDIR /usr/src/app
COPY ./package*.json ./
RUN npm i
COPY . .
RUN rm -rf .env
RUN npx prisma generate
RUN npx prisma db push
RUN npm run build

FROM builder AS development
WORKDIR /usr/src/app
COPY --from=builder /usr/src/app .
EXPOSE 8080
CMD ["npm", "run", "start:dev"]