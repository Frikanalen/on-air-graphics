FROM node:24-alpine AS builder

WORKDIR /app

COPY package.json yarn.lock ./
RUN yarn install --frozen-lockfile --ignore-scripts

COPY . .
RUN yarn test && yarn lint && yarn build

FROM nginx:1.30.6-alpine

COPY --from=builder /app/dist /usr/share/nginx/html/graphics
RUN test -s /usr/share/nginx/html/graphics/fonts/InterVariable.woff2 \
    && test -s /usr/share/nginx/html/graphics/scene/grain.png \
    && test -s /usr/share/nginx/html/graphics/scene/blade-0-lit.svg
