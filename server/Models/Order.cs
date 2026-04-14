using System.ComponentModel.DataAnnotations;
using System.Text.Json.Serialization;
using System.ComponentModel.DataAnnotations.Schema;
namespace server.Models
{
    public class Order
    {
        [Key]
        public int Id { get; set; }
        
        public int UserId { get; set; }
        
        public decimal TotalPrice { get; set; }
        
        public string Status { get; set; } = "completed";
        
        public DateTime CreatedAt { get; set; } = DateTime.UtcNow;
        
        [ForeignKey("UserId")]
        [JsonIgnore]
        public virtual User? User { get; set; }
        
        public virtual ICollection<OrderItem>? Items { get; set; }
    }
}