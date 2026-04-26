using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using server.Data;
using server.Models;

namespace server.Controllers;

[ApiController]
[Route("api/[controller]")]
[Authorize]
public class CartController : ControllerBase
{
    private readonly AppDbContext _context;
    private readonly ILogger<CartController> _logger;

    public CartController(AppDbContext context, ILogger<CartController> logger)
    {
        _context = context;
        _logger = logger;
    }

    // GET: api/cart - Получить корзину текущего пользователя
    [HttpGet]
    public async Task<ActionResult<CartDto>> GetCart()
    {
        var userId = int.Parse(User.FindFirst(System.Security.Claims.ClaimTypes.NameIdentifier)?.Value!);
        
        var cartItems = await _context.CartItems
            .Where(ci => ci.UserId == userId)
            .Include(ci => ci.Game)
            .Select(ci => new CartItemDto
            {
                GameId = ci.GameId,
                Title = ci.Game.Title,
                ImageUrl = ci.Game.ImageUrl,
                Price = ci.Game.Price,
                Genre = ci.Game.Genre,
                AddedAt = ci.AddedAt
            })
            .ToListAsync();

        var total = cartItems.Sum(item => item.Price);

        return Ok(new CartDto
        {
            Items = cartItems,
            TotalPrice = total,
            ItemsCount = cartItems.Count
        });
    }

    // POST: api/cart/add/{gameId} - Добавить игру в корзину
    [HttpPost("add/{gameId}")]
    public async Task<IActionResult> AddToCart(int gameId)
    {
        var userId = int.Parse(User.FindFirst(System.Security.Claims.ClaimTypes.NameIdentifier)?.Value!);
        
        // Проверяем, есть ли игра
        var game = await _context.Games.FindAsync(gameId);
        if (game == null)
            return NotFound(new { message = "Игра не найдена" });

        // Проверяем, не куплена ли уже
        var alreadyOwned = await _context.UserGames
            .AnyAsync(ug => ug.UserId == userId && ug.GameId == gameId);
        
        if (alreadyOwned)
            return BadRequest(new { message = "У вас уже есть эта игра" });

        // Проверяем, есть ли уже в корзине
        var existingCartItem = await _context.CartItems
            .FirstOrDefaultAsync(ci => ci.UserId == userId && ci.GameId == gameId);
        
        if (existingCartItem != null)
            return BadRequest(new { message = "Игра уже в корзине" });

        // Добавляем в корзину
        var cartItem = new CartItem
        {
            UserId = userId,
            GameId = gameId,
            AddedAt = DateTime.UtcNow
        };

        _context.CartItems.Add(cartItem);
        await _context.SaveChangesAsync();

        _logger.LogInformation($"User {userId} added game {gameId} to cart");

        return Ok(new { success = true, message = "Игра добавлена в корзину" });
    }

    // DELETE: api/cart/remove/{gameId} - Удалить игру из корзины
    [HttpDelete("remove/{gameId}")]
    public async Task<IActionResult> RemoveFromCart(int gameId)
    {
        var userId = int.Parse(User.FindFirst(System.Security.Claims.ClaimTypes.NameIdentifier)?.Value!);
        
        var cartItem = await _context.CartItems
            .FirstOrDefaultAsync(ci => ci.UserId == userId && ci.GameId == gameId);

        if (cartItem == null)
            return NotFound(new { message = "Игра не найдена в корзине" });

        _context.CartItems.Remove(cartItem);
        await _context.SaveChangesAsync();

        return Ok(new { success = true, message = "Игра удалена из корзины" });
    }

    // POST: api/cart/checkout - Оформить заказ
    [HttpPost("checkout")]
    public async Task<IActionResult> Checkout()
    {
        var userId = int.Parse(User.FindFirst(System.Security.Claims.ClaimTypes.NameIdentifier)?.Value!);
        
        var user = await _context.Users.FindAsync(userId);
        if (user == null)
            return NotFound(new { message = "Пользователь не найден" });

        var cartItems = await _context.CartItems
            .Where(ci => ci.UserId == userId)
            .Include(ci => ci.Game)
            .ToListAsync();

        if (!cartItems.Any())
            return BadRequest(new { message = "Корзина пуста" });

        // Проверяем, нет ли уже купленных игр
        foreach (var item in cartItems)
        {
            var alreadyOwned = await _context.UserGames
                .AnyAsync(ug => ug.UserId == userId && ug.GameId == item.GameId);
            
            if (alreadyOwned)
                return BadRequest(new { message = $"Игра \"{item.Game.Title}\" уже куплена" });
        }

        // Считаем общую сумму
        var totalPrice = cartItems.Sum(ci => ci.Game.Price);

        // Проверяем баланс
        if (user.Balance < totalPrice)
            return BadRequest(new { 
                message = "Недостаточно средств на балансе",
                required = totalPrice,
                balance = user.Balance
            });

        // Списываем средства
        user.Balance -= totalPrice;

        // Создаём заказ
        var order = new Order
        {
            UserId = userId,
            TotalPrice = totalPrice,
            Status = "completed",
            CreatedAt = DateTime.UtcNow
        };
        _context.Orders.Add(order);
        await _context.SaveChangesAsync();

        // Добавляем игры в библиотеку и создаём элементы заказа
        foreach (var item in cartItems)
        {
            // Добавляем в библиотеку
            _context.UserGames.Add(new UserGame
            {
                UserId = userId,
                GameId = item.GameId,
                PurchasedAt = DateTime.UtcNow
            });

            // Создаём элемент заказа
            _context.OrderItems.Add(new OrderItem
            {
                OrderId = order.Id,
                GameId = item.GameId,
                Price = item.Game.Price
            });

            // Создаём транзакцию
            _context.PaymentTransactions.Add(new PaymentTransaction
            {
                UserId = userId,
                Amount = item.Game.Price,
                Type = "purchase",
                Status = "completed",
                TransactionDate = DateTime.UtcNow,
                Description = $"Покупка игры: {item.Game.Title}"
            });

            // Удаляем из корзины
            _context.CartItems.Remove(item);
        }

        await _context.SaveChangesAsync();

        _logger.LogInformation($"User {userId} checked out cart with {cartItems.Count} games");

        return Ok(new
        {
            success = true,
            message = $"Куплено {cartItems.Count} игр на сумму {totalPrice} ₽",
            newBalance = user.Balance,
            orderId = order.Id,
            purchasedGames = cartItems.Select(ci => new { ci.GameId, ci.Game.Title })
        });
    }

    // DELETE: api/cart/clear - Очистить корзину
    [HttpDelete("clear")]
    public async Task<IActionResult> ClearCart()
    {
        var userId = int.Parse(User.FindFirst(System.Security.Claims.ClaimTypes.NameIdentifier)?.Value!);
        
        var cartItems = await _context.CartItems
            .Where(ci => ci.UserId == userId)
            .ToListAsync();

        _context.CartItems.RemoveRange(cartItems);
        await _context.SaveChangesAsync();

        return Ok(new { success = true, message = "Корзина очищена" });
    }
}

// DTO
public class CartDto
{
    public List<CartItemDto> Items { get; set; } = new();
    public decimal TotalPrice { get; set; }
    public int ItemsCount { get; set; }
}

public class CartItemDto
{
    public int GameId { get; set; }
    public string Title { get; set; } = string.Empty;
    public string? ImageUrl { get; set; }
    public decimal Price { get; set; }
    public string Genre { get; set; } = string.Empty;
    public DateTime AddedAt { get; set; }
}