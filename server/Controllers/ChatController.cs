using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using server.Data;
using server.Models;

namespace server.Controllers;

[ApiController]
[Route("api/[controller]")]
[Authorize]
public class ChatController : ControllerBase
{
    private readonly AppDbContext _context;

    public ChatController(AppDbContext context)
    {
        _context = context;
    }

    // GET: api/chat/conversations
    [HttpGet("conversations")]
   public async Task<ActionResult<List<ConversationDto>>> GetConversations()
{
    var userId = int.Parse(User.FindFirst(System.Security.Claims.ClaimTypes.NameIdentifier)?.Value!);
    
    var otherUserIds = await _context.Messages
        .Where(m => m.SenderId == userId || m.RecipientId == userId)
        .Select(m => m.SenderId == userId ? m.RecipientId : m.SenderId)
        .Distinct()
        .ToListAsync();

    var conversations = new List<ConversationDto>();
    
    foreach (var otherId in otherUserIds)
    {
        var lastMessage = await _context.Messages
            .Where(m => 
                (m.SenderId == userId && m.RecipientId == otherId) ||
                (m.SenderId == otherId && m.RecipientId == userId))
            .OrderByDescending(m => m.SentAt)
            .FirstOrDefaultAsync();

        var unreadCount = await _context.Messages
            .CountAsync(m => m.SenderId == otherId && m.RecipientId == userId && !m.IsRead);

        var otherUser = await _context.Users.FindAsync(otherId);
        if (otherUser != null)
        {
            conversations.Add(new ConversationDto
            {
                UserId = otherUser.Id,
                Username = otherUser.Username,
                Avatar = otherUser.Avatar,
                IsOnline = otherUser.IsOnline,
                LastMessage = lastMessage?.Content,
                LastMessageAt = lastMessage?.SentAt,
                UnreadCount = unreadCount
            });
        }
    }

    return Ok(conversations.OrderByDescending(c => c.LastMessageAt).ToList());
}

    // GET: api/chat/messages/{userId}
    [HttpGet("messages/{userId}")]
    public async Task<ActionResult<List<ChatMessageDto>>> GetMessages(int userId)
    {
        var currentUserId = int.Parse(User.FindFirst(System.Security.Claims.ClaimTypes.NameIdentifier)?.Value!);
        
        var messages = await _context.Messages
            .Where(m => 
                (m.SenderId == currentUserId && m.RecipientId == userId) ||
                (m.SenderId == userId && m.RecipientId == currentUserId))
            .OrderBy(m => m.SentAt)
            .Select(m => new ChatMessageDto
            {
                Id = m.Id,
                SenderId = m.SenderId,
                RecipientId = m.RecipientId,
                Content = m.Content,
                SentAt = m.SentAt,
                IsRead = m.IsRead
            })
            .ToListAsync();

        // Помечаем сообщения как прочитанные
        var unreadIds = messages
            .Where(m => m.RecipientId == currentUserId && !m.IsRead)
            .Select(m => m.Id)
            .ToList();
            
        if (unreadIds.Any())
        {
            var msgs = await _context.Messages
                .Where(m => unreadIds.Contains(m.Id))
                .ToListAsync();
            foreach (var m in msgs) m.IsRead = true;
            await _context.SaveChangesAsync();
        }

        return Ok(messages);
    }

    // POST: api/chat/mark-read/{userId}
    [HttpPost("mark-read/{userId}")]
    public async Task<IActionResult> MarkMessagesRead(int userId)
    {
        var currentUserId = int.Parse(User.FindFirst(System.Security.Claims.ClaimTypes.NameIdentifier)?.Value!);
        
        var messages = await _context.Messages
            .Where(m => m.SenderId == userId && m.RecipientId == currentUserId && !m.IsRead)
            .ToListAsync();

        foreach (var m in messages) m.IsRead = true;
        await _context.SaveChangesAsync();

        return Ok();
    }
}

// DTO для списка диалогов
public class ConversationDto
{
    public int UserId { get; set; }
    public string Username { get; set; } = string.Empty;
    public string? Avatar { get; set; }
    public bool IsOnline { get; set; }
    public string? LastMessage { get; set; }
    public DateTime? LastMessageAt { get; set; }
    public int UnreadCount { get; set; }
}