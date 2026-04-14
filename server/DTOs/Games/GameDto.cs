namespace server.DTOs.Games
{
    public class GameDto
    {
        public int Id { get; set; }
        public string Title { get; set; } = string.Empty;
        public string? Description { get; set; }
        public string? ImageUrl { get; set; }
        public decimal Price { get; set; }
        public string? ExternalUrl { get; set; }
        public string Genre { get; set; } = string.Empty;
        public double Rating { get; set; }
    }
}