using System.ComponentModel.DataAnnotations;
using System.Text.Json.Serialization;
using System.ComponentModel.DataAnnotations.Schema;
namespace server.Models
{
    public class OrderItem
    {
        [Key]
        public int Id { get; set; }
        
        public int OrderId { get; set; }
        
        public int GameId { get; set; }
        
        public decimal Price { get; set; }
        
        [ForeignKey("OrderId")]
        [JsonIgnore]
        public virtual Order? Order { get; set; }
        
        [ForeignKey("GameId")]
        public virtual Game? Game { get; set; }
    }
}