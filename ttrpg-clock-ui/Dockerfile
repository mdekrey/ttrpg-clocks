FROM nginx:stable-alpine AS nginx-spa
# From https://github.com/steebchen/nginx-spa

RUN sed -i '1idaemon off;' /etc/nginx/nginx.conf

COPY nginx/nginx.conf /etc/nginx/conf.d/default.conf

CMD ["nginx"]

FROM node:12 AS builder

WORKDIR /src
ADD package*.json ./
RUN npm ci
ADD / ./
RUN npm run build

FROM nginx-spa
COPY --from=builder /src/public /app
