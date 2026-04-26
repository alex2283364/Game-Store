using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using server.Data;
using server.Models;

namespace server.Controllers;

[ApiController]
[Route("api/[controller]")]
[Authorize]
public class FriendsController : ControllerBase
{
    private readonly AppDbContext _context;
    private readonly ILogger<FriendsController> _logger;

    public FriendsController(AppDbContext context, ILogger<FriendsController> logger)
    {
        _context = context;
        _logger = logger;
    }

    // GET: api/friends - Список друзей
    [HttpGet]
    public async Task<ActionResult<List<FriendDto>>> GetFriends()
    {
        var userId = int.Parse(User.FindFirst(System.Security.Claims.ClaimTypes.NameIdentifier)?.Value!);
        
        var friendships = await _context.Friendships
            .Where(f => f.UserId == userId && f.Status == "accepted")
            .Include(f => f.Friend)
            .Select(f => new FriendDto
            {
                Id = f.Friend.Id,
                Username = f.Friend.Username,
                Avatar = f.Friend.Avatar,
                IsOnline = f.Friend.IsOnline,
                AddedAt = f.AcceptedAt ?? f.CreatedAt
            })
            .ToListAsync();

        return Ok(friendships);
    }

    // GET: api/friends/search?query=... - Поиск пользователей
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

    // POST: api/friends/request/{userId} - Отправить заявку в друзья
    [HttpPost("request/{userId}")]
    public async Task<IActionResult> SendFriendRequest(int userId)
    {
        var currentUserId = int.Parse(User.FindFirst(System.Security.Claims.ClaimTypes.NameIdentifier)?.Value!);
        
        if (currentUserId == userId)
            return BadRequest("Нельзя добавить себя в друзья");

        // Проверяем, не друзья ли уже
        var existingFriendship = await _context.Friendships
            .FirstOrDefaultAsync(f => 
                (f.UserId == currentUserId && f.FriendId == userId) ||
                (f.UserId == userId && f.FriendId == currentUserId));

        if (existingFriendship != null)
            return BadRequest("Заявка уже отправлена или вы уже друзья");

        var friendship = new Friendship
        {
            UserId = currentUserId,
            FriendId = userId,
            Status = "pending",
            CreatedAt = DateTime.UtcNow
        };

        _context.Friendships.Add(friendship);
        await _context.SaveChangesAsync();

        return Ok(new { success = true, message = "Заявка в друзья отправлена" });
    }

  // POST: api/friends/accept/{userId} - Принять заявку
[HttpPost("accept/{userId}")]
public async Task<IActionResult> AcceptFriendRequest(int userId)
{
    var currentUserId = int.Parse(User.FindFirst(System.Security.Claims.ClaimTypes.NameIdentifier)?.Value!);
    
    // Находим существующую заявку
    var friendship = await _context.Friendships
        .FirstOrDefaultAsync(f => f.UserId == userId && f.FriendId == currentUserId);

    if (friendship == null)
        return NotFound(new { message = "Заявка не найдена" });

    // 🔥 Обновляем существующую заявку
    friendship.Status = "accepted";
    friendship.AcceptedAt = DateTime.UtcNow;

    // 🔥 Создаём ОБРАТНУЮ связь (двусторонняя дружба)
    var reverseFriendship = new Friendship
    {
        UserId = currentUserId,
        FriendId = userId,
        Status = "accepted",
        AcceptedAt = DateTime.UtcNow,
        CreatedAt = DateTime.UtcNow
    };

    _context.Friendships.Add(reverseFriendship);
    await _context.SaveChangesAsync();

    return Ok(new { success = true, message = "Друг добавлен" });
}
    // DELETE: api/friends/{userId} - Удалить из друзей
    [HttpDelete("{userId}")]
    public async Task<IActionResult> RemoveFriend(int userId)
    {
        var currentUserId = int.Parse(User.FindFirst(System.Security.Claims.ClaimTypes.NameIdentifier)?.Value!);
        
        var friendship = await _context.Friendships
            .FirstOrDefaultAsync(f => 
                (f.UserId == currentUserId && f.FriendId == userId) ||
                (f.UserId == userId && f.FriendId == currentUserId));

        if (friendship == null)
            return NotFound("Друг не найден");

        _context.Friendships.Remove(friendship);
        await _context.SaveChangesAsync();

        return Ok(new { success = true, message = "Друг удалён" });
    }

    // GET: api/friends/requests - Входящие заявки
    [HttpGet("requests")]
    public async Task<ActionResult<List<FriendRequestDto>>> GetFriendRequests()
    {
        var userId = int.Parse(User.FindFirst(System.Security.Claims.ClaimTypes.NameIdentifier)?.Value!);
        
        var requests = await _context.Friendships
            .Where(f => f.FriendId == userId && f.Status == "pending")
            .Include(f => f.User)
            .Select(f => new FriendRequestDto
            {
                Id = f.Id,
                UserId = f.User.Id,
                Username = f.User.Username,
                Avatar = f.User.Avatar,
                SentAt = f.CreatedAt
            })
            .ToListAsync();

        return Ok(requests);
    }
}

// DTO
public class FriendDto
{
    public int Id { get; set; }
    public string Username { get; set; } = string.Empty;
    public string? Avatar { get; set; }
    public bool IsOnline { get; set; }
    public DateTime AddedAt { get; set; }
}

public class UserSearchDto
{
    public int Id { get; set; }
    public string Username { get; set; } = string.Empty;
    public string? Avatar { get; set; }
    public bool IsOnline { get; set; }
}

public class FriendRequestDto
{
    public int Id { get; set; }
    public int UserId { get; set; }
    public string Username { get; set; } = string.Empty;
    public string? Avatar { get; set; }
    public DateTime SentAt { get; set; }
}