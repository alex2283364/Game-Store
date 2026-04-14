using server.DTOs.Auth;
using server.Models;
using Microsoft.EntityFrameworkCore;

namespace server.Services
{
    public interface IAuthService
    {
        Task<User> RegisterAsync(RegisterDto dto);
        Task<User> LoginAsync(string username, string password);
        Task<User?> GetByIdAsync(int id);
    }
}