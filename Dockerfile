FROM node:18-alpine AS deps

WORKDIR /usr/app

COPY package.json package-lock.json .

RUN npm install --omit=dev

FROM deps AS builder

ENV NODE_PORT 3000
ENV NODE_ENV production
ENV NEXT_PUBLIC_ENV production

COPY . .

RUN echo "Europe/Oslo" > /etc/timezone

USER node

ENTRYPOINT ["/usr/local/bin/yarn"]

CMD ["run", "start"]
