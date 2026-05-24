using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using server.Data;
using server.Models;
using server.DTOs.Auth;

namespace server.Controllers;

[ApiController]
[Route("api/[controller]")]
[Authorize]
public class UsersController : ControllerBase
{
    private readonly AppDbContext _context;

    public UsersController(AppDbContext context)
    {
        _context = context;
    }

    // GET: api/users/search?query=
    [HttpGet("search")]
    public async Task<ActionResult<List<UserSearchDto>>> SearchUsers([FromQuery] string query)
    {
        var userId = int.Parse(User.FindFirst(System.Security.Claims.ClaimTypes.NameIdentifier)?.Value!);
        
        if (string.IsNullOrWhiteSpace(query))
            return Ok(new List<UserSearchDto>());

        var users = await _context.Users
            .Where(u => u.Id != userId && 
                       (EF.Functions.ILike(u.Username, $"%{query}%") || 
                        EF.Functions.ILike(u.Email, $"%{query}%")))
            .Select(u => new UserSearchDto
            {
                Id = u.Id,
                Username = u.Username,
                Avatar = u.Avatar,
                IsOnline = u.IsOnline
            })
            .Take(10)
            .ToListAsync();

        return Ok(users);
    }

    // GET: api/users/profile
    [HttpGet("profile")]
    public async Task<ActionResult<UserProfileDto>> GetProfile()
    {
        var userId = int.Parse(User.FindFirst(System.Security.Claims.ClaimTypes.NameIdentifier)?.Value!);
        
        var user = await _context.Users
            .Where(u => u.Id == userId)
            .Select(u => new UserProfileDto
            {
                Id = u.Id,
                Username = u.Username,
                Email = u.Email,
                Avatar = u.Avatar,
                Balance = u.Balance,
                CreatedAt = u.CreatedAt,
                OwnedGamesCount = u.OwnedGames.Count,
                TotalSpent = u.Orders.Sum(o => o.TotalPrice)
            })
            .FirstOrDefaultAsync();

        if (user == null)
            return NotFound();

        return Ok(user);
    }

    // PUT: api/users/profile
    [HttpPut("profile")]
    public async Task<IActionResult> UpdateProfile([FromBody] UpdateProfileDto dto)
    {
        var userId = int.Parse(User.FindFirst(System.Security.Claims.ClaimTypes.NameIdentifier)?.Value!);
        
        var user = await _context.Users.FindAsync(userId);
        if (user == null)
            return NotFound();

        if (!string.IsNullOrEmpty(dto.Avatar))
            user.Avatar = dto.Avatar;

        await _context.SaveChangesAsync();
        return Ok(new { success = true, message = "Профиль обновлен" });
    }

    // GET: api/users/profile/games
    [HttpGet("profile/games")]
    public async Task<ActionResult<List<UserGameDto>>> GetOwnedGames()
    {
        var userId = int.Parse(User.FindFirst(System.Security.Claims.ClaimTypes.NameIdentifier)?.Value!);
        
        var ownedGames = await _context.UserGames
             .Where(ug => ug.UserId == userId)
            .Include(ug => ug.Game)
            .Select(ug => new UserGameDto
            {
                Id = ug.Game.Id,
                Title = ug.Game.Title,
                Description = ug.Game.Description,
                ImageUrl = ug.Game.ImageUrl,
                Price = ug.Game.Price,
                Genre = ug.Game.Genre,
                PurchasedAt = ug.PurchasedAt
            })
            .ToListAsync();

        return Ok(ownedGames);
    }
}

// DTO для профиля
public class UserProfileDto
{
    public int Id { get; set; }
    public string Username { get; set; } = string.Empty;
    public string Email { get; set; } = string.Empty;
    public string? Avatar { get; set; }
    public decimal Balance { get; set; }
    public DateTime CreatedAt { get; set; }
    public int OwnedGamesCount { get; set; }
    public decimal TotalSpent { get; set; }
}

public class UserSearchDto
{
    public int Id { get; set; }
    public string Username { get; set; } = string.Empty;
    public string? Avatar { get; set; }
    public bool IsOnline { get; set; }
}

// DTO для обновления профиля
public class UpdateProfileDto
{
    public string? Avatar { get; set; }
}

// DTO для игры пользователя
public class UserGameDto
{
    public int Id { get; set; }
    public string Title { get; set; } = string.Empty;
    public string? Description { get; set; }
    public string? ImageUrl { get; set; }
    public decimal Price { get; set; }
    public string Genre { get; set; } = string.Empty;
    public DateTime PurchasedAt { get; set; }
}
