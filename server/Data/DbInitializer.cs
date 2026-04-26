using server.Models;

namespace server.Data;

public static class DbInitializer
{
    public static void Initialize(AppDbContext db)
    {
        Console.WriteLine("✅ Тестовые игры добавлены в базу!");
    }
}