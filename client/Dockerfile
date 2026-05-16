# Stage 1: Build
FROM node:18-alpine AS build
WORKDIR /app

# Копируем ТОЛЬКО package файлы
COPY package.json ./
COPY yarn.lock ./

# Устанавливаем зависимости
RUN yarn install --frozen-lockfile

# Копируем исходный код
COPY . ./

# Строим приложение
RUN yarn build

# Stage 2: Serve
FROM nginx:alpine

# Копируем билд
COPY --from=build /app/build /usr/share/nginx/html

# Копируем конфиг
COPY nginx.conf /etc/nginx/conf.d/default.conf

EXPOSE 80

CMD ["nginx", "-g", "daemon off;"]
