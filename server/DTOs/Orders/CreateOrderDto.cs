namespace server.DTOs.Orders
{
    public class CreateOrderDto
    {
        public List<int> GameIds { get; set; } = new();
    }
}