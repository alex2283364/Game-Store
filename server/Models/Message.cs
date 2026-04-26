using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;

namespace server.Models;

public class Message
{
    [Key]
    public int Id { get; set; }
    
    public int SenderId { get; set; }
    [ForeignKey("SenderId")]
    public User Sender { get; set; } = null!;
    
    public int RecipientId { get; set; }
    [ForeignKey("RecipientId")]
    public User Recipient { get; set; } = null!;
    
    public string Content { get; set; } = string.Empty;
    
    public bool IsRead { get; set; }
    
    public DateTime SentAt { get; set; } = DateTime.UtcNow;
}