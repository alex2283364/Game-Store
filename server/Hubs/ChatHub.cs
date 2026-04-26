using Microsoft.AspNetCore.SignalR;
using Microsoft.AspNetCore.Authorization;
using server.Data;
using server.Models;
using Microsoft.EntityFrameworkCore;

namespace server.Hubs;

[Authorize]
public class ChatHub : Hub
{
    private readonly ILogger<ChatHub> _logger;
    private readonly AppDbContext _context;

    public ChatHub(ILogger<ChatHub> logger, AppDbContext context)
    {
        _logger = logger;
        _context = context;
    }

    // 🔥 ОТПРАВКА СООБЩЕНИЯ
   public async Task SendMessage(string recipientId, string content)
{
    var senderId = Context.UserIdentifier;
    
    if (string.IsNullOrEmpty(senderId) || string.IsNullOrEmpty(recipientId) || string.IsNullOrEmpty(content))
        return;

    var message = new Message
    {
        SenderId = int.Parse(senderId),
        RecipientId = int.Parse(recipientId),
        Content = content.Trim(),
        SentAt = DateTime.UtcNow,
        IsRead = false
    };

    _context.Messages.Add(message);
    await _context.SaveChangesAsync();

    var savedMessage = await _context.Messages
        .Where(m => m.Id == message.Id)
        .Select(m => new
        {
            m.Id,
            m.SenderId,
            m.RecipientId,
            m.Content,
            m.SentAt,
            m.IsRead
        })
        .FirstOrDefaultAsync();

    if (savedMessage != null)
    {
        // 🔥 Отправляем ПОЛУЧАТЕЛЮ
        await Clients.User(recipientId).SendAsync("ReceiveMessage", savedMessage);
        
        // 🔥 Отправляем ОТПРАВИТЕЛЮ
        await Clients.Caller.SendAsync("MessageSent", savedMessage);
    }
}
    // Подключение пользователя
    public override async Task OnConnectedAsync()
    {
        var userId = Context.UserIdentifier;
        if (!string.IsNullOrEmpty(userId))
        {
            var user = await _context.Users.FindAsync(int.Parse(userId));
            if (user != null)
            {
                user.IsOnline = true;
                await _context.SaveChangesAsync();
                await Clients.Others.SendAsync("UserStatusChanged", userId, true);
            }
        }
        await base.OnConnectedAsync();
    }

    // Отключение пользователя
    public override async Task OnDisconnectedAsync(Exception? exception)
    {
        var userId = Context.UserIdentifier;
        if (!string.IsNullOrEmpty(userId))
        {
            var user = await _context.Users.FindAsync(int.Parse(userId));
            if (user != null)
            {
                user.IsOnline = false;
                await _context.SaveChangesAsync();
                await Clients.Others.SendAsync("UserStatusChanged", userId, false);
            }
        }
        await base.OnDisconnectedAsync(exception);
    }
}