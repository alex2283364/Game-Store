using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;

namespace server.Models;

public class Order
{
    [Key]
    public int Id { get; set; }
    
    public int UserId { get; set; }
    [ForeignKey("UserId")]
    public User User { get; set; } = null!;
    
    public decimal TotalPrice { get; set; }
    
    public string Status { get; set; } = "completed";
    
    public DateTime CreatedAt { get; set; } = DateTime.UtcNow;
    
    // 🔥 Должно быть OrderItems, не Items!
    public ICollection<OrderItem> OrderItems { get; set; } = new List<OrderItem>();
}