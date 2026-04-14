using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;
namespace server.Models
{
    public class Game
    {
        [Key]
        public int Id { get; set; }
        
        [Required, StringLength(100)]
        public string Title { get; set; } = string.Empty;
        
        [StringLength(500)]
        public string? Description { get; set; }
        
        public string? ImageUrl { get; set; }
        
        public decimal Price { get; set; }
        
        public string? ExternalUrl { get; set; }
        
        public string Genre { get; set; } = string.Empty;
        
        public double Rating { get; set; } = 0;
        
        public DateTime ReleaseDate { get; set; } = DateTime.UtcNow;
        
        public virtual ICollection<OrderItem>? OrderItems { get; set; }
    }
}