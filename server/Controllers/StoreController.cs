using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using server.Data;
using server.Models;

namespace server.Controllers;

[ApiController]
[Route("api/[controller]")]
[Authorize]
public class StoreController : ControllerBase
{
    private readonly AppDbContext _context;
    private readonly ILogger<StoreController> _logger;

    public StoreController(AppDbContext context, ILogger<StoreController> logger)
    {
        _context = context;
        _logger = logger;
    }

    // POST: api/store/purchase/{gameId} - Купить игру
    [HttpPost("purchase/{gameId}")]
    public async Task<IActionResult> PurchaseGame(int gameId)
    {
        var userId = int.Parse(User.FindFirst(System.Security.Claims.ClaimTypes.NameIdentifier)?.Value!);
        
        var user = await _context.Users
            .Include(u => u.OwnedGames)
            .FirstOrDefaultAsync(u => u.Id == userId);
        
        if (user == null)
            return NotFound(new { message = "Пользователь не найден" });

        var game = await _context.Games.FindAsync(gameId);
        if (game == null)
            return NotFound(new { message = "Игра не найдена" });

        // Проверяем, не куплена ли уже
        if (user.OwnedGames.Any(og => og.GameId == gameId))
            return BadRequest(new { message = "У вас уже есть эта игра" });

        // Проверяем баланс
        if (user.Balance < game.Price)
            return BadRequest(new { 
                message = "Недостаточно средств на балансе",
                required = game.Price,
                balance = user.Balance
            });

        // Списываем средства
        user.Balance -= game.Price;

        // Добавляем игру в библиотеку
        var userGame = new UserGame
        {
            UserId = userId,
            GameId = gameId,
            PurchasedAt = DateTime.UtcNow
        };
        _context.UserGames.Add(userGame);

        // Создаем заказ
        var order = new Order
        {
            UserId = userId,
            TotalPrice = game.Price,
            Status = "completed",
            CreatedAt = DateTime.UtcNow
        };
        _context.Orders.Add(order);
        await _context.SaveChangesAsync();

        // Создаем элемент заказа
        var orderItem = new OrderItem
        {
            OrderId = order.Id,
            GameId = gameId,
            Price = game.Price
        };
        _context.OrderItems.Add(orderItem);
        await _context.SaveChangesAsync();

        // Создаем транзакцию
        var transaction = new PaymentTransaction
        {
            UserId = userId,
            Amount = game.Price,
            Type = "purchase",
            Status = "completed",
            TransactionDate = DateTime.UtcNow,
            Description = $"Покупка игры: {game.Title}"
        };
        _context.PaymentTransactions.Add(transaction);
        await _context.SaveChangesAsync();

        _logger.LogInformation($"User {userId} purchased game {gameId}");

        return Ok(new
        {
            success = true,
            message = $"Игра \"{game.Title}\" успешно куплена!",
            newBalance = user.Balance,
            gameId = game.Id
        });
    }
}