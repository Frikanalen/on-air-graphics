FROM node:16-alpine AS builder

WORKDIR /usr/app

COPY package.json .

RUN yarn install --quiet

FROM builder

ENV NODE_PORT 80
ENV NODE_ENV production
ENV NEXT_PUBLIC_ENV production

COPY . .

RUN echo "Europe/Oslo" > /etc/timezone

USER node

ENTRYPOINT ["/usr/local/bin/yarn"]

CMD ["run", "start"]
