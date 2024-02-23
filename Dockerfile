FROM node:20-alpine AS builder

WORKDIR /app

COPY . .

RUN yarn

RUN yarn build

FROM nginx

RUN mkdir /usr/share/nginx/html/graphics
COPY --from=builder /app/dist /usr/share/nginx/html/graphics
