using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using server.Data;
using server.Models;
using System.ComponentModel.DataAnnotations;

namespace server.Controllers;

[ApiController]
[Route("api/[controller]")]
[Authorize]
public class PaymentController : ControllerBase
{
    private readonly AppDbContext _context;
    private readonly ILogger<PaymentController> _logger;

    public PaymentController(AppDbContext context, ILogger<PaymentController> logger)
    {
        _context = context;
        _logger = logger;
    }

    // POST: api/payment/topup - Пополнить счет (ТЕСТОВАЯ ЗАГЛУШКА)
    [HttpPost("topup")]
    public async Task<IActionResult> TopUpAccount([FromBody] TopUpDto dto)
    {
        try
        {
            var userId = int.Parse(User.FindFirst(System.Security.Claims.ClaimTypes.NameIdentifier)?.Value!);
            
            var user = await _context.Users.FindAsync(userId);
            if (user == null)
                return NotFound(new { message = "Пользователь не найден" });

            // 🔥 ЗАГЛУШКА - просто добавляем сумму к балансу
            // В реальности здесь была бы интеграция с платежной системой
            user.Balance += dto.Amount;

            // Создаем запись о транзакции
            var transaction = new PaymentTransaction
            {
                UserId = userId,
                Amount = dto.Amount,
                Type = "topup",
                Status = "completed",
                TransactionDate = DateTime.UtcNow,
                Description = $"Пополнение счета (тест): {dto.CardNumber}"
            };

            _context.PaymentTransactions.Add(transaction);
            await _context.SaveChangesAsync();

            _logger.LogInformation($"User {userId} topped up {dto.Amount} RUB");

            return Ok(new
            {
                success = true,
                newBalance = user.Balance,
                message = $"Счет пополнен на {dto.Amount} ₽"
            });
        }
        catch (Exception ex)
        {
            _logger.LogError(ex, "Error during top-up");
            return StatusCode(500, new { message = "Ошибка пополнения счета" });
        }
    }

    // GET: api/payment/history - История транзакций
    [HttpGet("history")]
    public async Task<ActionResult<List<PaymentTransactionDto>>> GetTransactionHistory()
    {
        var userId = int.Parse(User.FindFirst(System.Security.Claims.ClaimTypes.NameIdentifier)?.Value!);
        
        var transactions = await _context.PaymentTransactions
            .Where(t => t.UserId == userId)
            .OrderByDescending(t => t.TransactionDate)
            .Select(t => new PaymentTransactionDto
            {
                Id = t.Id,
                Amount = t.Amount,
                Type = t.Type,
                Status = t.Status,
                TransactionDate = t.TransactionDate,
                Description = t.Description
            })
            .ToListAsync();

        return Ok(transactions);
    }
}

// DTO для пополнения счета
public class TopUpDto
{
    [Required]
    [Range(10, 100000)]
    public decimal Amount { get; set; }
    
    // Тестовые данные карты (не сохраняем!)
    public string CardNumber { get; set; } = "**** **** **** ****";
    public string CardHolder { get; set; } = string.Empty;
}

// DTO для транзакции
public class PaymentTransactionDto
{
    public int Id { get; set; }
    public decimal Amount { get; set; }
    public string Type { get; set; } = string.Empty;
    public string Status { get; set; } = string.Empty;
    public DateTime TransactionDate { get; set; }
    public string? Description { get; set; }
}