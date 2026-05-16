# Stage 1: Build
FROM node:18-alpine AS build
WORKDIR /app

COPY client/package.json ./
COPY client/package-lock.json ./

RUN yarn install --legacy-peer-deps --frozen-lockfile
RUN chmod -R 755 node_modules/.bin

COPY client/ ./
RUN chmod -R 755 node_modules/.bin
RUN yarn build

# Stage 2: Serve
FROM nginx:alpine

# Копируем файлы
COPY --from=build /app/build /usr/share/nginx/html
COPY client/nginx.conf /etc/nginx/conf.d/default.conf

# 🔥 Создаем кэш директорию и даем права ДО переключения на nginx
RUN mkdir -p /var/cache/nginx/client_temp && \
    chown -R nginx:nginx /var/cache/nginx && \
    chown -R nginx:nginx /usr/share/nginx/html && \
    chown -R nginx:nginx /etc/nginx/conf.d

EXPOSE 80

CMD ["nginx", "-g", "daemon off;"]