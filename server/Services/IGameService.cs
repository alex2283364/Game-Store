using server.Models;
using Microsoft.EntityFrameworkCore;
namespace server.Services
{
    public interface IGameService
    {
        Task<List<Game>> GetAllAsync();
        Task<Game?> GetByIdAsync(int id);
        Task<List<Game>> GetByGenreAsync(string genre);
    }
}