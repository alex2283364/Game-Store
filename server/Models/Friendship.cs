using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;

namespace server.Models;

public class Friendship
{
    [Key]
    public int Id { get; set; }
    
    public int UserId { get; set; }
    [ForeignKey("UserId")]
    public User User { get; set; } = null!;
    
    public int FriendId { get; set; }
    [ForeignKey("FriendId")]
    public User Friend { get; set; } = null!;
    
    public string Status { get; set; } = "pending"; // pending, accepted, blocked
    public DateTime CreatedAt { get; set; } = DateTime.UtcNow;
    public DateTime? AcceptedAt { get; set; }
}