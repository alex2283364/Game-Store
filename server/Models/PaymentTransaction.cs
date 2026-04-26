using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;

namespace server.Models;

public class PaymentTransaction
{
    [Key]
    public int Id { get; set; }
    
    public int UserId { get; set; }
    [ForeignKey("UserId")]
    public User User { get; set; } = null!;
    
    public decimal Amount { get; set; }
    
    public string Type { get; set; } = string.Empty; // "topup" или "purchase"
    
    public string Status { get; set; } = string.Empty;
    
    public DateTime TransactionDate { get; set; } = DateTime.UtcNow;
    
    public string? Description { get; set; }
}