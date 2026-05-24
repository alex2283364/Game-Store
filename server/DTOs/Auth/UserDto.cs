namespace server.DTOs.Auth{
    public class UserDto
    {
        public int Id { get; set; }
        public string Username { get; set; } = string.Empty;
        public string Email { get; set; } = string.Empty;
        public string? Avatar { get; set; }
        public decimal Balance { get; set; }
        public bool IsOnline { get; set; }
        public DateTime CreatedAt { get; set; }
    }
}