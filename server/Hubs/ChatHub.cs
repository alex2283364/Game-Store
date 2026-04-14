using Microsoft.AspNetCore.SignalR;
using Microsoft.AspNetCore.Authorization;

namespace server.Hubs
{
    [Authorize]
    public class ChatHub : Hub
    {
        private readonly ILogger<ChatHub> _logger;

        public ChatHub(ILogger<ChatHub> logger)
        {
            _logger = logger;
        }

        public override async Task OnConnectedAsync()
        {
            var userId = Context.UserIdentifier;
            _logger.LogInformation($"User {userId} connected");
            await Clients.Caller.SendAsync("Connected", Context.ConnectionId);
            await base.OnConnectedAsync();
        }

        public override async Task OnDisconnectedAsync(Exception? exception)
        {
            var userId = Context.UserIdentifier;
            _logger.LogInformation($"User {userId} disconnected");
            await base.OnDisconnectedAsync(exception);
        }

        public async Task SendMessage(string recipientId, string message)
        {
            var senderId = Context.UserIdentifier;
            
            await Clients.User(recipientId).SendAsync("ReceiveMessage", new
            {
                senderId,
                recipientId,
                message,
                timestamp = DateTime.UtcNow
            });
        }

        public async Task JoinConversation(string conversationId)
        {
            await Groups.AddToGroupAsync(Context.ConnectionId, conversationId);
        }

        public async Task LeaveConversation(string conversationId)
        {
            await Groups.RemoveFromGroupAsync(Context.ConnectionId, conversationId);
        }
    }
}