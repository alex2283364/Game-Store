using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using server.Data;
using server.Models;

namespace server.Controllers;

[ApiController]
[Route("api/[controller]")]
[Authorize]
public class OrdersController : ControllerBase
{
    private readonly AppDbContext _context;

    public OrdersController(AppDbContext context)
    {
        _context = context;
    }

    // GET: api/orders - История заказов текущего пользователя
    [HttpGet]
    public async Task<ActionResult<List<OrderDto>>> GetOrders()
    {
        var userId = int.Parse(User.FindFirst(System.Security.Claims.ClaimTypes.NameIdentifier)?.Value!);
        
        var orders = await _context.Orders
            .Where(o => o.UserId == userId)
            .Include(o => o.OrderItems)  // 🔥 ИСПРАВЛЕНО: было .Items
                .ThenInclude(oi => oi.Game)
            .OrderByDescending(o => o.CreatedAt)
            .Select(o => new OrderDto
            {
                Id = o.Id,
                TotalPrice = o.TotalPrice,
                Status = o.Status,
                CreatedAt = o.CreatedAt,
                Items = o.OrderItems.Select(oi => new OrderItemDto  // 🔥 ИСПРАВЛЕНО: было o.Items
                {
                    GameId = oi.GameId,
                    GameTitle = oi.Game.Title,
                    Price = oi.Price
                }).ToList()
            })
            .ToListAsync();

        return Ok(orders);
    }

    // GET: api/orders/{id} - Детали заказа
    [HttpGet("{id}")]
    public async Task<ActionResult<OrderDto>> GetOrder(int id)
    {
        var userId = int.Parse(User.FindFirst(System.Security.Claims.ClaimTypes.NameIdentifier)?.Value!);
        
        var order = await _context.Orders
            .Where(o => o.Id == id && o.UserId == userId)
            .Include(o => o.OrderItems)  // 🔥 ИСПРАВЛЕНО: было .Items
                .ThenInclude(oi => oi.Game)
            .Select(o => new OrderDto
            {
                Id = o.Id,
                TotalPrice = o.TotalPrice,
                Status = o.Status,
                CreatedAt = o.CreatedAt,
                Items = o.OrderItems.Select(oi => new OrderItemDto  // 🔥 ИСПРАВЛЕНО: было o.Items
                {
                    GameId = oi.GameId,
                    GameTitle = oi.Game.Title,
                    Price = oi.Price
                }).ToList()
            })
            .FirstOrDefaultAsync();

        if (order == null)
            return NotFound();

        return Ok(order);
    }
}

// DTO для заказа
public class OrderDto
{
    public int Id { get; set; }
    public decimal TotalPrice { get; set; }
    public string Status { get; set; } = string.Empty;
    public DateTime CreatedAt { get; set; }
    public List<OrderItemDto> Items { get; set; } = new List<OrderItemDto>();
}

// DTO для элемента заказа
public class OrderItemDto
{
    public int GameId { get; set; }
    public string GameTitle { get; set; } = string.Empty;
    public decimal Price { get; set; }
}