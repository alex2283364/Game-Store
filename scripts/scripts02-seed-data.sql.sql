-- =====================================================
-- GAMING PORTAL - Наполнение базы данных
-- =====================================================

-- 4. Заполняем тестовыми данными

-- Тестовые пользователи (пароли хешированы через BCrypt)
-- Пароль для всех: "123456" (хеш примерный, для реального проекта генерируйте новый)
INSERT INTO "Users" ("Username", "Email", "PasswordHash", "Balance", "IsOnline")
VALUES 
  ('admin', 'admin@gaming.com', '$2a$11$rO7z..XqK8JZvL9mH5nF7eGxPqW3sY4tU6vR8wA2bC1dE0fG9hI8j', 10000.00, TRUE),
  ('player1', 'player1@gaming.com', '$2a$11$rO7z..XqK8JZvL9mH5nF7eGxPqW3sY4tU6vR8wA2bC1dE0fG9hI8j', 5000.00, TRUE),
  ('player2', 'player2@gaming.com', '$2a$11$rO7z..XqK8JZvL9mH5nF7eGxPqW3sY4tU6vR8wA2bC1dE0fG9hI8j', 3000.00, FALSE),
  ('gamer2026', 'gamer2026@gaming.com', '$2a$11$rO7z..XqK8JZvL9mH5nF7eGxPqW3sY4tU6vR8wA2bC1dE0fG9hI8j', 1500.00, TRUE);

-- Тестовые игры (30 игр)
INSERT INTO "Games" ("Title", "Description", "ImageUrl", "Price", "Genre", "Rating", "ReleaseDate")
VALUES 
  -- RPG игры
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
    'The Elder Scrolls V: Skyrim',
    'RPG в фэнтези мире. Стань Драконорождённым и спаси мир от драконов.',
    'https://via.placeholder.com/300x200?text=Skyrim',
    899.00,
    'RPG',
    4.9,
    '2011-11-11'
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
    'The Witcher 2: Assassins of Kings',
    'Продолжение истории Геральта. Политические интриги и моральный выбор.',
    'https://via.placeholder.com/300x200?text=Witcher2',
    599.00,
    'RPG',
    4.6,
    '2011-05-17'
  ),
  (
    'Final Fantasy XV',
    'Японская RPG про принца Ноктиса и его друзей. Эпичное путешествие.',
    'https://via.placeholder.com/300x200?text=FF15',
    1299.00,
    'RPG',
    4.4,
    '2016-11-29'
  ),
  
  -- Action игры
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
    'Red Dead Redemption 2',
    'Вестерн от Rockstar. История банды Ван дер Линде на закате Дикого Запада.',
    'https://via.placeholder.com/300x200?text=RDR2',
    1999.00,
    'Action',
    4.9,
    '2018-10-26'
  ),
  (
    'God of War',
    'Эпическое приключение Кратоса и Атрея в мире скандинавской мифологии.',
    'https://via.placeholder.com/300x200?text=GodOfWar',
    1999.00,
    'Action',
    4.9,
    '2018-04-20'
  ),
  (
    'DOOM Eternal',
    'Быстрый и жестокий шутер от первого лица. Уничтожай демонов!',
    'https://via.placeholder.com/300x200?text=DOOM',
    1499.00,
    'Shooter',
    4.7,
    '2020-03-20'
  ),
  (
    'Assassin''s Creed Valhalla',
    'Приключения викинга Эвора в Англии 9 века.',
    'https://via.placeholder.com/300x200?text=ACValhalla',
    1799.00,
    'Action',
    4.5,
    '2020-11-10'
  ),
  
  -- Sandbox и Simulation
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
    'Stardew Valley',
    'Симулятор фермы. Выращивай урожай, рыбачь, общайся с жителями долины.',
    'https://via.placeholder.com/300x200?text=StardewValley',
    399.00,
    'Simulation',
    4.9,
    '2016-02-26'
  ),
  (
    'Terraria',
    '2D песочница про исследование, строительство и сражения.',
    'https://via.placeholder.com/300x200?text=Terraria',
    299.00,
    'Sandbox',
    4.8,
    '2011-05-16'
  ),
  (
    'The Sims 4',
    'Симулятор жизни. Создавай персонажей, строй дома, управляй жизнью.',
    'https://via.placeholder.com/300x200?text=Sims4',
    1499.00,
    'Simulation',
    4.3,
    '2014-09-02'
  ),
  
  -- Puzzle и Indie
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
    'Hollow Knight',
    'Метроидвания с красивой рисованной графикой и сложным геймплеем.',
    'https://via.placeholder.com/300x200?text=HollowKnight',
    399.00,
    'Indie',
    4.8,
    '2017-02-24'
  ),
  (
    'Celeste',
    'Платформер про девушку Мадлен, которая карабкается на гору Селеста.',
    'https://via.placeholder.com/300x200?text=Celeste',
    399.00,
    'Indie',
    4.9,
    '2018-01-25'
  ),
  (
    'Undertale',
    'Культовая RPG, где не обязательно убивать монстров.',
    'https://via.placeholder.com/300x200?text=Undertale',
    299.00,
    'Indie',
    4.8,
    '2015-09-15'
  ),
  
  -- Adventure
  (
    'The Legend of Zelda: Breath of the Wild',
    'Приключенческая игра от Nintendo. Исследуй королевство Хайрул.',
    'https://via.placeholder.com/300x200?text=Zelda',
    2499.00,
    'Adventure',
    4.9,
    '2017-03-03'
  ),
  (
    'Uncharted 4: A Thief''s End',
    'Последнее приключение Нейтана Дрейка. Сокровища, экшен, драма.',
    'https://via.placeholder.com/300x200?text=Uncharted4',
    1499.00,
    'Adventure',
    4.8,
    '2016-05-10'
  ),
  (
    'Tomb Raider (2013)',
    'Перезапуск серии про Лару Крофт. Выживание на таинственном острове.',
    'https://via.placeholder.com/300x200?text=TombRaider',
    599.00,
    'Adventure',
    4.6,
    '2013-03-05'
  ),
  
  -- Multiplayer
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
    'Counter-Strike: Global Offensive',
    'Классический командный шутер. Террористы против спецназа.',
    'https://via.placeholder.com/300x200?text=CSGO',
    0.00,
    'Shooter',
    4.5,
    '2012-08-21'
  ),
  (
    'Fall Guys',
    'Весёлая королевская битва с мини-играми и препятствиями.',
    'https://via.placeholder.com/300x200?text=FallGuys',
    0.00,
    'Multiplayer',
    4.2,
    '2020-08-04'
  ),
  (
    'Rocket League',
    'Футбол на машинах. Быстро, весело, соревновательно.',
    'https://via.placeholder.com/300x200?text=RocketLeague',
    0.00,
    'Sports',
    4.6,
    '2015-07-07'
  ),
  
  -- Strategy
  (
    'Civilization VI',
    'Пошаговая стратегия. Построй величайшую империю в истории.',
    'https://via.placeholder.com/300x200?text=Civ6',
    1499.00,
    'Strategy',
    4.7,
    '2016-10-21'
  ),
  (
    'StarCraft II',
    'Легендарная RTS. Терраны, зерги и протоссы в эпических битвах.',
    'https://via.placeholder.com/300x200?text=StarCraft2',
    0.00,
    'Strategy',
    4.7,
    '2010-07-27'
  ),
  (
    'XCOM 2',
    'Тактическая стратегия про сопротивление инопланетному вторжению.',
    'https://via.placeholder.com/300x200?text=XCOM2',
    999.00,
    'Strategy',
    4.6,
    '2016-02-05'
  ),
  
  -- Horror
  (
    'Resident Evil Village',
    'Продолжение истории Итана Уинтерса. Деревня вампиров и монстров.',
    'https://via.placeholder.com/300x200?text=RE8',
    1999.00,
    'Horror',
    4.7,
    '2021-05-07'
  ),
  (
    'Dead Space',
    'Хоррор в космосе. Инженер Айзек Кларк против некроморфов.',
    'https://via.placeholder.com/300x200?text=DeadSpace',
    1499.00,
    'Horror',
    4.8,
    '2023-01-27'
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
  (1, 1, 999.00),   -- Witcher 3
  (1, 7, 1299.00),  -- GTA V
  (2, 12, 799.00),  -- Minecraft
  (3, 2, 1499.00),  -- Cyberpunk
  (4, 3, 899.00);   -- Skyrim

-- Тестовые сообщения
INSERT INTO "Messages" ("SenderId", "RecipientId", "Content", "IsRead", "SentAt")
VALUES 
  (2, 1, 'Привет! Как тебе Witcher 3?', FALSE, NOW() - INTERVAL '2 hours'),
  (1, 2, 'Отличная игра! Прошёл уже 50 часов', TRUE, NOW() - INTERVAL '1 hour'),
  (3, 1, 'Когда в онлайн?', FALSE, NOW() - INTERVAL '30 minutes'),
  (1, 3, 'Вечером заходи', TRUE, NOW() - INTERVAL '25 minutes'),
  (4, 2, 'Купил Cyberpunk, стоит начинать?', FALSE, NOW() - INTERVAL '10 minutes');


-- =====================================================
-- ИСПРАВЛЕНИЕ: Локальные пути к картинкам (БЕЗ ПРОБЕЛОВ!)
-- =====================================================

UPDATE "Games" SET "ImageUrl" = '/images/games/' || 
  CASE "Id"
    WHEN 1 THEN 'TheWitcher3WildHunt.jpeg'
    WHEN 2 THEN 'Cyberpunk2077.jpg'
    WHEN 3 THEN 'TheElderScrollsVSkyrim.jpg'
    WHEN 4 THEN 'DarkSoulsIII.jpg'
    WHEN 5 THEN 'TheWitcher2AssassinsofKings.jpg'
    WHEN 6 THEN 'FinalFantasyXV.jpg'
    WHEN 7 THEN 'GrandTheftAutoV.jfif'
    WHEN 8 THEN 'RedDeadRedemption2.jfif'
    WHEN 9 THEN 'GodofWar.jfif'
    WHEN 10 THEN 'DOOMEternal.jfif'
    WHEN 11 THEN 'AssassinsCreedValhalla.jpg'
    WHEN 12 THEN 'Minecraft.jfif'
    WHEN 13 THEN 'StardewValley.jpeg'
    WHEN 14 THEN 'Terraria.jfif'
    WHEN 15 THEN 'TheSims4.jfif'
    WHEN 16 THEN 'Portal2.jpg'
    WHEN 17 THEN 'HollowKnight.jpg'
    WHEN 18 THEN 'Celeste.jfif'
    WHEN 19 THEN 'Undertale.jpg'
    WHEN 20 THEN 'TheLegendofZeldaBreathoftheWild.jpeg'
    WHEN 21 THEN 'Uncharted4AThiefsEnd.jpg'
    WHEN 22 THEN 'TombRaider2013.jfif'
    WHEN 23 THEN 'AmongUs.jfif'
    WHEN 24 THEN 'CounterStrikeGlobalOffensive.jpeg'
    WHEN 25 THEN 'FallGuys.jfif'
    WHEN 26 THEN 'RocketLeague.jpg'
    WHEN 27 THEN 'CivilizationVI.jpg'
    WHEN 28 THEN 'StarCraftII.jpeg'
    WHEN 29 THEN 'XCOM2.jpeg'
    WHEN 30 THEN 'ResidentEvilVillage.jfif'
    WHEN 31 THEN 'DeadSpace.jfif'
    ELSE 'placeholder.jpg'
  END
WHERE "Id" <= 31;

-- Проверка для Assassin's Creed Valhalla (ID=11)
SELECT "Id", "Title", "ImageUrl" FROM "Games" WHERE "Id" = 11;
