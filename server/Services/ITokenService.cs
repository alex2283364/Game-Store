using server.Models;
using Microsoft.EntityFrameworkCore;
namespace server.Services
{
    public interface ITokenService
    {
        string GenerateToken(User user);
    }
}