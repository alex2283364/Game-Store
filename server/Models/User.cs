using System.ComponentModel.DataAnnotations;
using System.Text.Json.Serialization;
using System.ComponentModel.DataAnnotations.Schema;
namespace server.Models
{
    public class User
    {
        [Key]
        public int Id { get; set; }
        
        [Required, StringLength(50)]
        public string Username { get; set; } = string.Empty;
        
        [Required, EmailAddress]
        public string Email { get; set; } = string.Empty;
        
        [Required]
        public string PasswordHash { get; set; } = string.Empty;
        
        public string? Avatar { get; set; }
        
        public decimal Balance { get; set; } = 0;
        
        public bool IsOnline { get; set; } = false;
        
        public DateTime CreatedAt { get; set; } = DateTime.UtcNow;
        
        [JsonIgnore]
        public virtual ICollection<Order>? Orders { get; set; }
        
        [JsonIgnore]
        public virtual ICollection<Message>? SentMessages { get; set; }
        
        [JsonIgnore]
        public virtual ICollection<Message>? ReceivedMessages { get; set; }
    }
}