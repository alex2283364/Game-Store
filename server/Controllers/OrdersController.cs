using System.Security.Claims;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using server.Data;
using server.DTOs.Orders;
using server.Models;

namespace server.Controllers
{
    [ApiController]
    [Route("api/[controller]")]
    [Authorize]
    public class OrdersController : ControllerBase
    {
        private readonly AppDbContext _context;
        private readonly ILogger<OrdersController> _logger;

        public OrdersController(AppDbContext context, ILogger<OrdersController> logger)
        {
            _context = context;
            _logger = logger;
        }

        [HttpPost]
        public async Task<IActionResult> CreateOrder([FromBody] CreateOrderDto dto)
        {
            try
            {
                var userId = int.Parse(User.FindFirst(ClaimTypes.NameIdentifier)?.Value!);
                
                var games = await _context.Games
                    .Where(g => dto.GameIds.Contains(g.Id))
                    .ToListAsync();

                if (games.Count != dto.GameIds.Count)
                    return BadRequest(new { message = "Some games not found" });

                var totalPrice = games.Sum(g => g.Price);

                var order = new Order
                {
                    UserId = userId,
                    TotalPrice = totalPrice,
                    Status = "completed",
                    CreatedAt = DateTime.UtcNow,
                    Items = games.Select(g => new OrderItem
                    {
                        GameId = g.Id,
                        Price = g.Price
                    }).ToList()
                };

                _context.Orders.Add(order);
                await _context.SaveChangesAsync();

                return Ok(new { orderId = order.Id, total = totalPrice });
            }
            catch (Exception ex)
            {
                _logger.LogError(ex, "Order creation error");
                return StatusCode(500, new { message = ex.Message });
            }
        }

        [HttpGet("my")]
        public async Task<IActionResult> GetMyOrders()
        {
            var userId = int.Parse(User.FindFirst(ClaimTypes.NameIdentifier)?.Value!);
            
            var orders = await _context.Orders
                .Where(o => o.UserId == userId)
                .Include(o => o.Items)
                    .ThenInclude(i => i.Game)
                .OrderByDescending(o => o.CreatedAt)
                .ToListAsync();

            return Ok(orders);
        }
    }
}