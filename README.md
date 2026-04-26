# 🎮 Gaming Portal

**Gaming Portal** — это веб-платформа для покупки, управления и обсуждения игр. Включает в себя магазин, библиотеку игр, чат, систему друзей и личный кабинет с балансом.

---

## 📋 Содержание

- [Технологии](#-технологии)
- [Требования](#-требования)
- [Установка](#-установка)
- [Запуск проекта](#-запуск-проекта)
- [База данных](#-база-данных)
- [Тестовые аккаунты](#-тестовые-аккаунты)
- [API Endpoints](#-api-endpoints)
- [Структура проекта](#-структура-проекта)

---

## 🛠 Технологии

| Компонент | Технология |
|-----------|------------|
| **Backend** | .NET 10, ASP.NET Core, Entity Framework Core |
| **Frontend** | React, React Router, Axios |
| **База данных** | PostgreSQL 15+ |
| **Real-time** | SignalR (чат, уведомления) |
| **Аутентификация** | JWT (JSON Web Tokens) |
| **Пакетный менеджер** | Yarn (frontend), NuGet (backend) |

---

## 📦 Требования

Перед запуском убедитесь, что установлены:

- [**.NET 10 SDK**](https://dotnet.microsoft.com/download)
- **[Node.js 18+](https://nodejs.org/)** и **Yarn**
- **[PostgreSQL 15+](https://www.postgresql.org/download/)**
- **[pgAdmin](https://www.pgadmin.org/)** (опционально, для управления БД)

---

## 🚀 Установка

### 1. Клонируйте репозиторий

```bash
git clone https://github.com/yourusername/gaming-portal.git
cd gaming-portal
```

### 2. Настройка базы данных

1. Создайте базу данных в PostgreSQL:

```sql
CREATE DATABASE gaming_portal;
```

2. Выполните SQL скрипты из папки `scripts/`:

```bash
# В pgAdmin или через psql
psql -U postgres -d gaming_portal -f scripts/scripts01-create-schema.sql
psql -U postgres -d gaming_portal -f scripts/scripts02-seed-data.sql
```

### 3. Настройка Backend

1. Откройте файл `server/appsettings.json`:

```json
{
  "ConnectionStrings": {
    "DefaultConnection": "Host=localhost;Port=5432;Database=gaming_portal;Username=postgres;Password=your_password"
  },
  "JwtSettings": {
    "SecretKey": "your-secret-key-min-32-characters-long",
    "Issuer": "GamingPortal",
    "Audience": "GamingPortalUsers"
  }
}
```

2. Установите зависимости и примените миграции:

```bash
cd server
dotnet restore
dotnet ef database update
```

### 4. Настройка Frontend

```bash
cd client
yarn install
```

3. Создайте файл `.env` (если нужен):

```
REACT_APP_API_URL=http://localhost:5000/api
```

---

## ▶️ Запуск проекта

### Backend (Terminal 1)

```bash
cd server
dotnet run
```

Сервер запустится на **`http://localhost:5000`**

### Frontend (Terminal 2)

```bash
cd client
yarn start
```

Приложение откроется на **`http://localhost:3000`**

---

## 🗄 База данных

### Таблицы

| Таблица | Описание |
|---------|----------|
| `Users` | Пользователи (логин, email, баланс, аватар) |
| `Games` | Каталог игр (название, цена, жанр, рейтинг) |
| `Orders` | Заказы пользователей |
| `OrderItems` | Элементы заказа (связь заказов и игр) |
| `Messages` | Сообщения чата |
| `UserGames` | Библиотека игр пользователя |
| `CartItems` | Корзина покупок |
| `Friendships` | Система друзей |
| `PaymentTransactions` | История транзакций |

### Миграции

```bash
cd server
dotnet ef migrations add MigrationName
dotnet ef database update
```

---

## 👤 Тестовые аккаунты

| Логин | Пароль | Баланс | Роль |
|-------|--------|--------|------|
| `admin` | `123456` | 10 000 ₽ | Администратор |
| `player1` | `123456` | 5 000 ₽ | Пользователь |
| `player2` | `123456` | 3 000 ₽ | Пользователь |
| `gamer2026` | `123456` | 1 500 ₽ | Пользователь |

---

## 🌐 API Endpoints

### Аутентификация
| Метод | Endpoint | Описание |
|-------|----------|----------|
| POST | `/api/auth/login` | Вход |
| POST | `/api/auth/register` | Регистрация |

### Игры
| Метод | Endpoint | Описание |
|-------|----------|----------|
| GET | `/api/games` | Список всех игр |
| GET | `/api/games/{id}` | Информация об игре |
| GET | `/api/games/genre/{genre}` | Игры по жанру |

### Пользователь
| Метод | Endpoint | Описание |
|-------|----------|----------|
| GET | `/api/users/profile` | Профиль текущего пользователя |
| GET | `/api/users/profile/games` | Библиотека игр |
| PUT | `/api/users/profile` | Обновление профиля |

### Корзина
| Метод | Endpoint | Описание |
|-------|----------|----------|
| GET | `/api/cart` | Получить корзину |
| POST | `/api/cart/add/{gameId}` | Добавить в корзину |
| DELETE | `/api/cart/remove/{gameId}` | Удалить из корзины |
| POST | `/api/cart/checkout` | Оформить заказ |

### Покупки
| Метод | Endpoint | Описание |
|-------|----------|----------|
| POST | `/api/store/purchase/{gameId}` | Купить игру |

### Платежи
| Метод | Endpoint | Описание |
|-------|----------|----------|
| POST | `/api/payment/topup` | Пополнить баланс (тест) |
| GET | `/api/payment/history` | История транзакций |

### Друзья
| Метод | Endpoint | Описание |
|-------|----------|----------|
| GET | `/api/friends` | Список друзей |
| GET | `/api/friends/requests` | Входящие заявки |
| POST | `/api/friends/request/{userId}` | Отправить заявку |
| POST | `/api/friends/accept/{userId}` | Принять заявку |
| DELETE | `/api/friends/{userId}` | Удалить друга |
| GET | `/api/friends/search?query=` | Поиск пользователей |

### Чат (SignalR)
| Hub | Endpoint | Описание |
|-----|----------|----------|
| ChatHub | `/chathub` | Обмен сообщениями |

---

## 📁 Структура проекта

```
gaming-portal/
├── server/                 # Backend (.NET)
│   ├── Controllers/        # API контроллеры
│   ├── Models/            # Модели данных
│   ├── Data/              # DbContext
│   ├── Hubs/              # SignalR хабы
│   ├── Middleware/        # Промежуточное ПО
│   ├── Services/          # Бизнес-логика
│   ├── Program.cs         # Точка входа
│   └── appsettings.json   # Конфигурация
│
├── client/                # Frontend (React)
│   ├── src/
│   │   ├── components/    # React компоненты
│   │   ├── pages/         # Страницы приложения
│   │   ├── context/       # Context API
│   │   ├── services/      # API сервисы
│   │   └── App.jsx        # Главный компонент
│   └── package.json
│
├── scripts/               # SQL скрипты
│   ├── scripts01-create-schema.sql
│   └── scripts02-seed-data.sql
│
└── README.md
```

---

## 🔧 Возможные проблемы

### Ошибка подключения к БД
```
Npgsql.PostgresException: 28P01
```
**Решение:** Проверьте логин/пароль в `appsettings.json`

### Порт 5000 занят
```
Error: Address already in use
```
**Решение:** Измените порт в `Properties/launchSettings.json`

### Картинки не загружаются
**Решение:** Выполните SQL для исправления URL:
```sql
UPDATE "Games" SET "ImageUrl" = REPLACE("ImageUrl", ' ', '');
```

### Ошибка CORS
**Решение:** Убедитесь, что в `Program.cs` настроен CORS для `http://localhost:3000`
