using server.Models;

namespace server.Data;

public static class DbInitializer
{
    public static void Initialize(AppDbContext db)
    {
        db.Database.EnsureCreated();
        
        // Если уже есть игры — не добавляем
        if (db.Games.Any()) 
        {
            Console.WriteLine("ℹ️ Игры уже есть в базе");
            return;
        }
        
        Console.WriteLine("🎮 Добавляем тестовые игры...");
        
        db.Games.AddRange(
            new Game 
            { 
                Title = "The Witcher 3: Wild Hunt",
                Description = "RPG про ведьмака Геральта из Ривии",
                ImageUrl = "https://via.placeholder.com/300x200?text=Witcher3",
                Price = 999,
                Genre = "RPG",
                Rating = 4.9,
                ReleaseDate = DateTime.UtcNow
            },
            new Game 
            { 
                Title = "Cyberpunk 2077",
                Description = "Экшен в мире будущего",
                ImageUrl = "https://via.placeholder.com/300x200?text=Cyberpunk",
                Price = 1499,
                Genre = "Action",
                Rating = 4.5,
                ReleaseDate = DateTime.UtcNow
            },
            new Game 
            { 
                Title = "Minecraft",
                Description = "Песочница про строительство",
                ImageUrl = "https://via.placeholder.com/300x200?text=Minecraft",
                Price = 799,
                Genre = "Sandbox",
                Rating = 4.8,
                ReleaseDate = DateTime.UtcNow
            },
            new Game 
            { 
                Title = "Grand Theft Auto V",
                Description = "Экшен в открытом мире",
                ImageUrl = "https://via.placeholder.com/300x200?text=GTA5",
                Price = 1299,
                Genre = "Action",
                Rating = 4.7,
                ReleaseDate = DateTime.UtcNow
            },
            new Game 
            { 
                Title = "The Elder Scrolls V: Skyrim",
                Description = "RPG в фэнтези мире",
                ImageUrl = "https://via.placeholder.com/300x200?text=Skyrim",
                Price = 899,
                Genre = "RPG",
                Rating = 4.9,
                ReleaseDate = DateTime.UtcNow
            }
        );
        
        db.SaveChanges();
        Console.WriteLine("✅ Тестовые игры добавлены в базу!");
    }
}