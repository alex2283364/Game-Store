-- =====================================================
-- GAMING PORTAL - Полная схема базы данных PostgreSQL
-- =====================================================

-- 1. Создаём базу данных (если не существует)
SELECT 'CREATE DATABASE gaming_portal'
WHERE NOT EXISTS (SELECT FROM pg_database WHERE datname = 'gaming_portal');

-- Подключаемся к базе (выполняется отдельно в pgAdmin)
-- \c gaming_portal

-- 2. Создаём таблицы

-- Таблица пользователей
CREATE TABLE IF NOT EXISTS "Users" (
    "Id" SERIAL PRIMARY KEY,
    "Username" VARCHAR(50) NOT NULL UNIQUE,
    "Email" VARCHAR(100) NOT NULL UNIQUE,
    "PasswordHash" TEXT NOT NULL,
    "Avatar" TEXT,
    "Balance" DECIMAL(10, 2) DEFAULT 0,
    "IsOnline" BOOLEAN DEFAULT FALSE,
    "CreatedAt" TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Таблица игр
CREATE TABLE IF NOT EXISTS "Games" (
    "Id" SERIAL PRIMARY KEY,
    "Title" VARCHAR(100) NOT NULL,
    "Description" TEXT,
    "ImageUrl" TEXT,
    "Price" DECIMAL(10, 2) NOT NULL DEFAULT 0,
    "ExternalUrl" TEXT,
    "Genre" VARCHAR(50) NOT NULL DEFAULT 'Other',
    "Rating" DECIMAL(3, 2) DEFAULT 0,
    "ReleaseDate" TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Таблица заказов
CREATE TABLE IF NOT EXISTS "Orders" (
    "Id" SERIAL PRIMARY KEY,
    "UserId" INTEGER NOT NULL,
    "TotalPrice" DECIMAL(10, 2) NOT NULL,
    "Status" VARCHAR(20) DEFAULT 'completed',
    "CreatedAt" TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    
    CONSTRAINT "FK_Orders_Users_UserId"
        FOREIGN KEY ("UserId")
        REFERENCES "Users" ("Id")
        ON DELETE CASCADE
);

-- Таблица элементов заказа (связь Orders ↔ Games)
CREATE TABLE IF NOT EXISTS "OrderItems" (
    "Id" SERIAL PRIMARY KEY,
    "OrderId" INTEGER NOT NULL,
    "GameId" INTEGER NOT NULL,
    "Price" DECIMAL(10, 2) NOT NULL,
    
    CONSTRAINT "FK_OrderItems_Orders_OrderId"
        FOREIGN KEY ("OrderId")
        REFERENCES "Orders" ("Id")
        ON DELETE CASCADE,
    
    CONSTRAINT "FK_OrderItems_Games_GameId"
        FOREIGN KEY ("GameId")
        REFERENCES "Games" ("Id")
        ON DELETE RESTRICT
);

-- Таблица сообщений (для чата)
CREATE TABLE IF NOT EXISTS "Messages" (
    "Id" SERIAL PRIMARY KEY,
    "SenderId" INTEGER NOT NULL,
    "RecipientId" INTEGER NOT NULL,
    "Content" TEXT NOT NULL,
    "IsRead" BOOLEAN DEFAULT FALSE,
    "SentAt" TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    
    CONSTRAINT "FK_Messages_Users_SenderId"
        FOREIGN KEY ("SenderId")
        REFERENCES "Users" ("Id")
        ON DELETE RESTRICT,
    
    CONSTRAINT "FK_Messages_Users_RecipientId"
        FOREIGN KEY ("RecipientId")
        REFERENCES "Users" ("Id")
        ON DELETE RESTRICT
);

-- 3. Создаём индексы для производительности

CREATE INDEX IF NOT EXISTS "IX_Users_Username" ON "Users" ("Username");
CREATE INDEX IF NOT EXISTS "IX_Users_Email" ON "Users" ("Email");

CREATE INDEX IF NOT EXISTS "IX_Games_Genre" ON "Games" ("Genre");
CREATE INDEX IF NOT EXISTS "IX_Games_Price" ON "Games" ("Price");

CREATE INDEX IF NOT EXISTS "IX_Orders_UserId" ON "Orders" ("UserId");
CREATE INDEX IF NOT EXISTS "IX_Orders_CreatedAt" ON "Orders" ("CreatedAt");

CREATE INDEX IF NOT EXISTS "IX_OrderItems_OrderId" ON "OrderItems" ("OrderId");
CREATE INDEX IF NOT EXISTS "IX_OrderItems_GameId" ON "OrderItems" ("GameId");

CREATE INDEX IF NOT EXISTS "IX_Messages_SenderId" ON "Messages" ("SenderId");
CREATE INDEX IF NOT EXISTS "IX_Messages_RecipientId" ON "Messages" ("RecipientId");

-- 4. Заполняем тестовыми данными

-- Тестовые пользователи (пароли хешированы через BCrypt)
-- Пароль для всех: "123456" (хеш примерный, для реального проекта генерируйте новый)
INSERT INTO "Users" ("Username", "Email", "PasswordHash", "Balance", "IsOnline")
VALUES 
  ('admin', 'admin@gaming.com', '$2a$11$rO7z..XqK8JZvL9mH5nF7eGxPqW3sY4tU6vR8wA2bC1dE0fG9hI8j', 10000.00, TRUE),
  ('player1', 'player1@gaming.com', '$2a$11$rO7z..XqK8JZvL9mH5nF7eGxPqW3sY4tU6vR8wA2bC1dE0fG9hI8j', 5000.00, TRUE),
  ('player2', 'player2@gaming.com', '$2a$11$rO7z..XqK8JZvL9mH5nF7eGxPqW3sY4tU6vR8wA2bC1dE0fG9hI8j', 3000.00, FALSE),
  ('gamer2026', 'gamer2026@gaming.com', '$2a$11$rO7z..XqK8JZvL9mH5nF7eGxPqW3sY4tU6vR8wA2bC1dE0fG9hI8j', 1500.00, TRUE);

-- Тестовые игры
INSERT INTO "Games" ("Title", "Description", "ImageUrl", "Price", "Genre", "Rating", "ReleaseDate")
VALUES 
  (
    'The Witcher 3: Wild Hunt',
    'RPG про ведьмака Геральта из Ривии. Открытый мир, захватывающий сюжет, более 100 часов геймплея.',
    'https://via.placeholder.com/300x200?text=Witcher3',
    999.00,
    'RPG',
    4.9,
    '2015-05-19'
  ),
  (
    'Cyberpunk 2077',
    'Экшен в мире будущего. Найт-Сити ждёт тебя! Ролевая игра от первого лица.',
    'https://via.placeholder.com/300x200?text=Cyberpunk',
    1499.00,
    'Action',
    4.5,
    '2020-12-10'
  ),
  (
    'Minecraft',
    'Песочница про строительство и выживание. Создавай миры, строй, исследуй!',
    'https://via.placeholder.com/300x200?text=Minecraft',
    799.00,
    'Sandbox',
    4.8,
    '2011-11-18'
  ),
  (
    'Grand Theft Auto V',
    'Экшен в открытом мире. Три героя, один город, бесконечные возможности.',
    'https://via.placeholder.com/300x200?text=GTA5',
    1299.00,
    'Action',
    4.7,
    '2013-09-17'
  ),
  (
    'The Elder Scrolls V: Skyrim',
    'RPG в фэнтези мире. Стань Драконорождённым и спаси мир от драконов.',
    'https://via.placeholder.com/300x200?text=Skyrim',
    899.00,
    'RPG',
    4.9,
    '2011-11-11'
  ),
  (
    'Red Dead Redemption 2',
    'Вестерн от Rockstar. История банды Ван дер Линде на закате Дикого Запада.',
    'https://via.placeholder.com/300x200?text=RDR2',
    1999.00,
    'Action',
    4.9,
    '2018-10-26'
  ),
  (
    'Portal 2',
    'Головоломка от первого лица. Порталы, физика, чёрный юмор GLaDOS.',
    'https://via.placeholder.com/300x200?text=Portal2',
    299.00,
    'Puzzle',
    4.9,
    '2011-04-19'
  ),
  (
    'Dark Souls III',
    'Хардкорный экшен-RPG. Сложные боссы, мрачная атмосфера, эпичные сражения.',
    'https://via.placeholder.com/300x200?text=DarkSouls3',
    1199.00,
    'RPG',
    4.7,
    '2016-04-12'
  ),
  (
    'Among Us',
    'Многопользовательская игра про предателей и членов экипажа на космическом корабле.',
    'https://via.placeholder.com/300x200?text=AmongUs',
    199.00,
    'Multiplayer',
    4.3,
    '2018-06-15'
  ),
  (
    'Stardew Valley',
    'Симулятор фермы. Выращивай урожай, рыбачь, общайся с жителями долины.',
    'https://via.placeholder.com/300x200?text=StardewValley',
    399.00,
    'Simulation',
    4.9,
    '2016-02-26'
  );

-- Тестовые заказы
INSERT INTO "Orders" ("UserId", "TotalPrice", "Status", "CreatedAt")
VALUES 
  (1, 2498.00, 'completed', NOW() - INTERVAL '7 days'),
  (1, 799.00, 'completed', NOW() - INTERVAL '3 days'),
  (2, 1499.00, 'completed', NOW() - INTERVAL '5 days'),
  (3, 899.00, 'completed', NOW() - INTERVAL '1 day');

-- Элементы заказов
INSERT INTO "OrderItems" ("OrderId", "GameId", "Price")
VALUES 
  (1, 1, 999.00),  -- Witcher 3
  (1, 4, 1299.00), -- GTA V
  (2, 3, 799.00),  -- Minecraft
  (3, 2, 1499.00), -- Cyberpunk
  (4, 5, 899.00);  -- Skyrim

-- Тестовые сообщения
INSERT INTO "Messages" ("SenderId", "RecipientId", "Content", "IsRead", "SentAt")
VALUES 
  (2, 1, 'Привет! Как тебе Witcher 3?', FALSE, NOW() - INTERVAL '2 hours'),
  (1, 2, 'Отличная игра! Прошёл уже 50 часов', TRUE, NOW() - INTERVAL '1 hour'),
  (3, 1, 'Когда в онлайн?', FALSE, NOW() - INTERVAL '30 minutes'),
  (1, 3, 'Вечером заходи', TRUE, NOW() - INTERVAL '25 minutes'),
  (4, 2, 'Купил Cyberpunk, стоит начинать?', FALSE, NOW() - INTERVAL '10 minutes');

