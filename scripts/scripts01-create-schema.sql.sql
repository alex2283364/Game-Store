-- =====================================================
-- GAMING PORTAL - Создание базы данных и таблиц
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

-- =====================================================
-- Добавление недостающих таблиц
-- =====================================================

-- Таблица UserGames (библиотека игр пользователя)
CREATE TABLE IF NOT EXISTS "UserGames" (
    "Id" SERIAL PRIMARY KEY,
    "UserId" INTEGER NOT NULL,
    "GameId" INTEGER NOT NULL,
    "PurchasedAt" TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    CONSTRAINT "FK_UserGames_Users_UserId"
        FOREIGN KEY ("UserId")
        REFERENCES "Users" ("Id")
        ON DELETE CASCADE,
    CONSTRAINT "FK_UserGames_Games_GameId"
        FOREIGN KEY ("GameId")
        REFERENCES "Games" ("Id")
        ON DELETE CASCADE
);

-- Уникальный индекс (пользователь не может купить одну игру дважды)
CREATE UNIQUE INDEX IF NOT EXISTS "IX_UserGames_UserId_GameId" 
ON "UserGames" ("UserId", "GameId");

-- Таблица PaymentTransactions (история транзакций)
CREATE TABLE IF NOT EXISTS "PaymentTransactions" (
    "Id" SERIAL PRIMARY KEY,
    "UserId" INTEGER NOT NULL,
    "Amount" DECIMAL(10, 2) NOT NULL,
    "Type" VARCHAR(20) NOT NULL,
    "Status" VARCHAR(20) NOT NULL,
    "TransactionDate" TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    "Description" TEXT,
    CONSTRAINT "FK_PaymentTransactions_Users_UserId"
        FOREIGN KEY ("UserId")
        REFERENCES "Users" ("Id")
        ON DELETE CASCADE
);

-- Индексы для производительности
CREATE INDEX IF NOT EXISTS "IX_PaymentTransactions_UserId" 
ON "PaymentTransactions" ("UserId");

CREATE INDEX IF NOT EXISTS "IX_PaymentTransactions_TransactionDate" 
ON "PaymentTransactions" ("TransactionDate");

SELECT '✅ Таблицы UserGames и PaymentTransactions созданы!' AS Status;

-- Создаём таблицу Friendships
CREATE TABLE IF NOT EXISTS "Friendships" (
    "Id" SERIAL PRIMARY KEY,
    "UserId" INTEGER NOT NULL,
    "FriendId" INTEGER NOT NULL,
    "Status" VARCHAR(20) NOT NULL DEFAULT 'pending',
    "CreatedAt" TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    "AcceptedAt" TIMESTAMP WITH TIME ZONE,
    
    CONSTRAINT "FK_Friendships_Users_UserId"
        FOREIGN KEY ("UserId")
        REFERENCES "Users" ("Id")
        ON DELETE CASCADE,
    
    CONSTRAINT "FK_Friendships_Users_FriendId"
        FOREIGN KEY ("FriendId")
        REFERENCES "Users" ("Id")
        ON DELETE RESTRICT
);

-- Уникальный индекс (чтобы нельзя было добавить одного друга дважды)
CREATE UNIQUE INDEX IF NOT EXISTS "IX_Friendships_UserId_FriendId" 
ON "Friendships" ("UserId", "FriendId");

-- Индексы для производительности
CREATE INDEX IF NOT EXISTS "IX_Friendships_UserId" 
ON "Friendships" ("UserId");

CREATE INDEX IF NOT EXISTS "IX_Friendships_FriendId" 
ON "Friendships" ("FriendId");

CREATE INDEX IF NOT EXISTS "IX_Friendships_Status" 
ON "Friendships" ("Status");

SELECT '✅ Таблица Friendships создана!' AS Status;

-- Готово!
SELECT '✅ Схема базы данных создана успешно!' AS Status;