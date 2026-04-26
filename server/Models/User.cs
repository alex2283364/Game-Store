using System.ComponentModel.DataAnnotations;

namespace server.Models;

public class User
{
    [Key]
    public int Id { get; set; }
    
    [Required]
    [MaxLength(50)]
    public string Username { get; set; } = string.Empty;
    
    [Required]
    [MaxLength(100)]
    public string Email { get; set; } = string.Empty;
    
    [Required]
    public string PasswordHash { get; set; } = string.Empty;
    
    public string? Avatar { get; set; }
    
    public decimal Balance { get; set; } = 0;
    
    public bool IsOnline { get; set; }
    
    public DateTime CreatedAt { get; set; } = DateTime.UtcNow;
    
    // Навигационные свойства
    public ICollection<Order> Orders { get; set; } = new List<Order>();
    public ICollection<UserGame> OwnedGames { get; set; } = new List<UserGame>();
    public ICollection<Message> SentMessages { get; set; } = new List<Message>();
    public ICollection<Message> ReceivedMessages { get; set; } = new List<Message>();
}