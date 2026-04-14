using System.ComponentModel.DataAnnotations;
using System.Text.Json.Serialization;
using System.ComponentModel.DataAnnotations.Schema;
namespace server.Models
{
    public class Message
    {
        [Key]
        public int Id { get; set; }
        
        public int SenderId { get; set; }
        
        public int RecipientId { get; set; }
        
        public string Content { get; set; } = string.Empty;
        
        public bool IsRead { get; set; } = false;
        
        public DateTime SentAt { get; set; } = DateTime.UtcNow;
        
        [ForeignKey("SenderId")]
        [JsonIgnore]
        public virtual User? Sender { get; set; }
        
        [ForeignKey("RecipientId")]
        [JsonIgnore]
        public virtual User? Recipient { get; set; }
    }
}