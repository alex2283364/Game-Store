🎮 Gaming Portal

Полнофункциональный игровой портал с магазином, чатом и системой авторизации.

---

 📋 Оглавление

- [Технологии](#-технологии)
- [Требования](#-требования)
- [Быстрый старт с Docker](#-быстрый-старт-с-docker)
- [Локальная разработка](#-локальная-разработка-без-docker)
- [Переменные окружения](#-переменные-окружения)
- [API Документация](#-api-документация)
- [Структура проекта](#-структура-проекта)
- [Устранение неполадок](#-устранение-неполадок)

---

 🔧 Технологии

# Frontend
| Технология | Версия | Описание |
|-----------|--------|----------|
| React | 18.x | UI библиотека |
| React Router | 6.x | Навигация |
| Axios | 1.x | HTTP клиент |
| SignalR | 8.x | Real-time чат |
| Node.js | 18.x+ | JavaScript runtime |

# Backend
| Технология | Версия | Описание |
|-----------|--------|----------|
| .NET | 10.0 | Web API framework |
| Entity Framework Core | 8.x | ORM |
| PostgreSQL | 15.x | База данных |
| JWT | - | Аутентификация |
| SignalR | - | WebSocket чат |

# DevOps
| Инструмент | Описание |
|-----------|----------|
| Docker | Контейнеризация |
| Docker Compose | Оркестрация |

---

 📦 Требования

# Для локальной разработки:
```bash
# Node.js и npm/yarn
node --version  # >= 18.x
npm --version   # >= 9.x
# или
yarn --version  # >= 1.22.x

# .NET SDK
dotnet --version  # >= 10.0

# PostgreSQL (опционально, если не через Docker)
psql --version  # >= 15.x
```

# Для Docker:
```bash
docker --version      # >= 20.x
docker compose version # >= 2.0.x
```

---

 🚀 Быстрый старт с Docker

# 1. Клонирование репозитория

```bash
git clone https://github.com/alex2283364/Game-Store.git
cd Game-Store
```

# 2. Запуск

```bash
# Запустить все сервисы
docker compose up -d

# Или с пересборкой
docker compose up --build -d
```

# 3. Проверка

| Сервис | URL | Описание |
|--------|-----|----------|
| Frontend | http://localhost:3000 | Основной сайт |
| Backend API | http://localhost:5000 | REST API |
| Swagger | http://localhost:5000/swagger | Документация API |
| PostgreSQL | localhost:5432 | База данных |

# 4. Управление

```bash
# Просмотр логов
docker compose logs -f

# Логи конкретного сервиса
docker compose logs -f server
docker compose logs -f client
docker compose logs -f postgres

# Остановка
docker compose down

# Полная очистка (удалит БД!)
docker compose down -v
```

---

 💻 Локальная разработка (без Docker)

# Backend (.NET)

```powershell
# Перейти в папку сервера
cd server

# Восстановить зависимости
dotnet restore

# Применить миграции БД
dotnet ef database update

# Запустить сервер
dotnet run
# Сервер запустится на: http://localhost:5000
```

# Frontend (React)

 Вариант 1: npm

```powershell
# Перейти в папку клиента
cd client

# Установить зависимости
npm install

# Запустить дев-сервер
npm start
# Приложение откроется на: http://localhost:3000
```

 Вариант 2: yarn

```powershell
# Перейти в папку клиента
cd client

# Установить зависимости
yarn install

# Запустить дев-сервер
yarn start
# Приложение откроется на: http://localhost:3000
```

# База данных (PostgreSQL)

```bash
# Создать БД вручную если не через Docker
createdb -U postgres gaming_portal

# Или использовать connection string в appsettings.json:
# "ConnectionStrings": {
#   "DefaultConnection": "Host=localhost;Port=5432;Database=gaming_portal;Username=postgres;Password=1"
# }
```

---

 ⚙️ Переменные окружения

# Backend (`server/appsettings.json` или `.env`)

```json
{
  "ConnectionStrings": {
    "DefaultConnection": "Host=postgres;Port=5432;Database=gaming_portal;Username=postgres;Password=1"
  },
  "JwtSettings": {
    "SecretKey": "YourSuperSecretKeyThatIsAtleast32CharactersLong!12345",
    "Issuer": "GamingPortal",
    "Audience": "GamingPortalUsers"
  },
  "ASPNETCORE_ENVIRONMENT": "Development"
}
```

# Frontend (`client/.env`)

```env
REACT_APP_API_URL=http://localhost:5000/api
```

---

 📚 API Документация

# Основные эндпоинты

 🔐 Аутентификация
```
POST /api/auth/register  - Регистрация пользователя
POST /api/auth/login     - Вход в систему
GET  /api/auth/me        - Получить текущий профиль (требует токен)
```

 🎮 Игры
```
GET /api/games           - Список всех игр
GET /api/games/{id}      - Информация об игре
GET /api/games/featured  - Популярные игры (для карусели)
```

 👤 Пользователи
```
GET  /api/users/search?query=  - Поиск пользователей
GET  /api/users/profile        - Профиль текущего пользователя
PUT  /api/users/profile        - Обновить профиль
GET  /api/users/profile/games  - Библиотека игр пользователя
```

 💬 Чат
```
GET    /api/chat/conversations          - Список диалогов
GET    /api/chat/messages/{userId}      - Сообщения с пользователем
POST   /api/chat/mark-read/{userId}     - Пометить как прочитанное
WS     /chathub                         - SignalR WebSocket
```

 🛒 Корзина и заказы
```
GET  /api/cart              - Получить корзину
POST /api/cart              - Добавить в корзину
DELETE /api/cart/{gameId}   - Удалить из корзины
POST /api/orders            - Создать заказ
GET  /api/orders            - История заказов
```

# Swagger UI

Откройте в браузере: http://localhost:5000/swagger

Для авторизованных запросов:
1. Нажмите Authorize в Swagger
2. Введите: `Bearer ваш_токен_из_логина`
3. Теперь можно тестировать защищённые эндпоинты

---

 📁 Структура проекта

```
Game-Store/
├──  docker-compose.yml      # Конфигурация Docker
├── 📄 README.md               # Этот файл
│
├──  client/                 # Frontend (React)
│   ├── 📄 package.json        # Зависимости и скрипты
│   ├── 📁 src/
│   │   ├── 📁 components/     # React компоненты
│   │   ├── 📁 pages/          # Страницы приложения
│   │   ├── 📁 services/       # API клиенты (axios, signalr)
│   │   ├── 📁 context/        # React Context (Auth)
│   │   └── 📄 App.jsx         # Корневой компонент
│   │
│   └──  public/             # Статические файлы
│
├──  server/                 # Backend (.NET)
│   ├── 📄 server.csproj       # Проект .NET
│   ├── 📄 Program.cs          # Точка входа
│   ├── 📄 appsettings.json    # Конфигурация
│   ├── 📁 Controllers/        # API контроллеры
│   │   ├── AuthController.cs
│   │   ├── GamesController.cs
│   │   ├── UsersController.cs
│   │   ├── ChatController.cs
│   │   └── ...
│   ├── 📁 Data/               # DbContext и миграции
│   ├── 📁 Models/             # Сущности БД
│   ├── 📁 DTOs/               # Data Transfer Objects
│   ├── 📁 Services/           # Бизнес-логика
│   ├── 📁 Hubs/               # SignalR хабы
│   └── 📁 wwwroot/            # Статические файлы
│       └── 📁 images/
│           └── 📁 games/      # Изображения игр
│
└──  scripts-docker/         # SQL скрипты инициализации
    ├── 01-create-schema.sql   # Создание таблиц
    └── 02-seed-data.sql       # Тестовые данные
```

---

 🔧 Устранение неполадок

# 🐳 Docker проблемы

| Проблема | Решение |
|----------|---------|
| Порт 5432 занят | Остановите локальный PostgreSQL или измените порт в docker-compose.yml |
| Контейнер падает с кодом 126 | Проверьте права на файлы: `chmod +x` для скриптов |
| БД не инициализируется | Удалите volume: `docker volume rm game-store_postgres_data` и перезапустите |
| Frontend не подключается к backend | Проверьте что `REACT_APP_API_URL=http://localhost:5000/api` |

# 🖥️ Локальная разработка

| Проблема | Решение |
|----------|---------|
| `npm: command not found` | Установите Node.js: https://nodejs.org/ |
| `yarn: command not found` | Установите Yarn: `npm install -g yarn` |
| `dotnet: command not found` | Установите .NET SDK: https://dotnet.microsoft.com/download |
| Ошибка подключения к БД | Проверьте connection string в appsettings.json |
| CORS ошибки | Убедитесь что backend запущен на порту 5000 и CORS настроен |

# 📦 npm/yarn проблемы

| Проблема | Решение |
|----------|---------|
| `npm install` зависает | Очистите кэш: `npm cache clean --force` |
| Конфликты зависимостей | Удалите node_modules и package-lock.json: `rm -rf node_modules package-lock.json && npm install` |
| Ошибки peer dependencies | Используйте `npm install --legacy-peer-deps` |
| Yarn не устанавливает пакеты | Попробуйте `yarn install --frozen-lockfile` |

# 🔐 Аутентификация

| Проблема | Решение |
|----------|---------|
| 401 Unauthorized | Проверьте что токен передаётся в заголовке: `Authorization: Bearer {token}` |
| Токен не работает | Убедитесь что SecretKey в backend совпадает с тем, что использовался при генерации |
| Не могу зарегистрироваться | Проверьте требования к паролю: минимум 6 символов |

# 💬 Чат не работает

| Проблема | Решение |
|----------|---------|
| Не подключается SignalR | Проверьте URL: `http://localhost:5000/chathub` должен быть доступен |
| Сообщения не отправляются | Убедитесь что пользователь авторизован и токен валиден |
| Поиск пользователей не работает | Проверьте что создан endpoint `/api/users/search` в UsersController |

---

 🔄 Обновление проекта

```bash
# 1. Получить последние изменения
git pull origin main

# 2. Пересобрать Docker контейнеры
docker compose down
docker compose build --no-cache
docker compose up -d

# 3. Применить миграции БД (если есть изменения)
docker exec -it gaming-server dotnet ef database update

# Или для локальной разработки:
cd server
dotnet ef database update
```

---

 🧪 Тестирование

# Backend тесты

```bash
cd server
dotnet test
```

# Frontend тесты

 npm
```bash
cd client
npm test
```

 yarn
```bash
cd client
yarn test
```

---

 📝 Полезные команды

# npm
```bash
# Установка зависимостей
npm install

# Запуск дев-сервера
npm start

# Сборка production версии
npm run build

# Запуск тестов
npm test

# Очистка кэша
npm cache clean --force
```

# yarn
```bash
# Установка зависимостей
yarn install

# Запуск дев-сервера
yarn start

# Сборка production версии
yarn build

# Запуск тестов
yarn test
```

# Docker
```bash
# Запуск всех сервисов
docker compose up -d

# Остановка всех сервисов
docker compose down

# Пересборка без кэша
docker compose build --no-cache

# Просмотр логов
docker compose logs -f

# Выполнить команду в контейнере
docker exec -it gaming-server bash
docker exec -it gaming-client sh

# Применить миграции БД
docker exec -it gaming-server dotnet ef database update
```
---

## 💬 Тестирование чата

Для проверки работоспособности чата выполните следующие шаги:

 🔹 Шаг 1: Зарегистрируйте первого пользователя

1. Откройте приложение: **http://localhost:3000**
2. Перейдите на страницу **Регистрация** (`/register`)
3. Заполните данные:
   - **Имя пользователя**: `name1`
   - **Email**: `name1@test.com`
   - **Пароль**: `password123`
4. Нажмите **Зарегистрироваться**

 🔹 Шаг 2: Зарегистрируйте второго пользователя

1. Выйдите из аккаунта (кнопка **Выйти** в хедере)
2. Снова перейдите на **Регистрацию**
3. Заполните данные:
   - **Имя пользователя**: `name2`
   - **Email**: `name2@test.com`
   - **Пароль**: `password123`
4. Нажмите **Зарегистрироваться**

 🔹 Шаг 3: Начните чат

1. Убедитесь, что вы вошли как `name2`
2. Перейдите в раздел **Чат** (`/chat`)
3. Нажмите кнопку **✏️ Новый чат**
4. В поле поиска введите `name1`
5. Кликните на найденного пользователя в результатах поиска

 🔹 Шаг 4: Проверьте обмен сообщениями

| Действие | Ожидаемый результат |
|----------|-------------------|
| Отправить сообщение от `name2` | Сообщение появляется в чате сразу |
| Переключиться на `name1` (в другом браузере/инкогнито) | Новое сообщение появляется автоматически |
| Ответить от `name1` | Сообщение доставляется `name2` в реальном времени |
| Обновить страницу | История сообщений сохраняется |

---

 📝 Лицензия

MIT © 2024 Gaming Portal

---

 👥 Авторы

- alex2283364 — основной разработчик

---

> 💡 Совет: При первом запуске создайте пользователя через регистрацию, затем добавьте игры через Swagger или напрямую в БД.

Приятной игры! 🎮✨
