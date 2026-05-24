using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using server.Data;
using server.Models;

namespace server.Controllers;

[ApiController]
[Route("api/[controller]")]
public class GamesController : ControllerBase
{
    private readonly AppDbContext _context;

    public GamesController(AppDbContext context)
    {
        _context = context;
    }

    // GET: api/games
    [HttpGet]
    public async Task<ActionResult<IEnumerable<Game>>> GetGames()
    {
        var games = await _context.Games
    .OrderByDescending(g => g.Rating)
    .ToListAsync();
        return Ok(games);
    }

    // GET: api/games/5
    [HttpGet("{id}")]
    public async Task<ActionResult<Game>> GetGame(int id)
    {
        var game = await _context.Games.FindAsync(id);
        
        if (game == null)
            return NotFound();
        
        return Ok(game);
    }

    // GET: api/games/genre/RPG
    [HttpGet("genre/{genre}")]
    public async Task<ActionResult<IEnumerable<Game>>> GetGamesByGenre(string genre)
    {
        var games = await _context.Games
            .Where(g => g.Genre == genre)
            .ToListAsync();
        
        return Ok(games);
    }
}