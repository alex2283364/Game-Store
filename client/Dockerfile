# Stage 1: Build
FROM node:18-alpine AS build
WORKDIR /app

COPY client/package.json ./
COPY client/package-lock.json ./

# Заменили npm ci на npm install (более мягкая установка)
RUN npm install --legacy-peer-deps

COPY client/ ./
RUN npm run build

# Stage 2: Serve
FROM nginx:alpine
COPY --from=build /app/build /usr/share/nginx/html
COPY client/nginx.conf /etc/nginx/conf.d/default.conf

EXPOSE 80
CMD ["nginx", "-g", "daemon off;"]