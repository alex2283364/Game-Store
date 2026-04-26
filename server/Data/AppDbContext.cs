using Microsoft.EntityFrameworkCore;
using server.Models;

namespace server.Data;

public class AppDbContext : DbContext
{
    public AppDbContext(DbContextOptions<AppDbContext> options) : base(options) { }

    // ========== Таблицы ==========
    public DbSet<User> Users { get; set; } = null!;
    public DbSet<Game> Games { get; set; } = null!;
    public DbSet<Order> Orders { get; set; } = null!;
    public DbSet<OrderItem> OrderItems { get; set; } = null!;
    public DbSet<Message> Messages { get; set; } = null!;
    public DbSet<UserGame> UserGames { get; set; } = null!;
    public DbSet<PaymentTransaction> PaymentTransactions { get; set; } = null!;

    public DbSet<Friendship> Friendships { get; set; } = null!;

    public DbSet<CartItem> CartItems { get; set; } = null!;


    protected override void OnModelCreating(ModelBuilder modelBuilder)
    {
        base.OnModelCreating(modelBuilder);

        // ========== Конфигурация User ==========
        modelBuilder.Entity<User>(entity =>
        {
            entity.HasIndex(e => e.Username).IsUnique();
            entity.HasIndex(e => e.Email).IsUnique();
            
            entity.HasMany(u => u.Orders)
                  .WithOne(o => o.User)
                  .HasForeignKey(o => o.UserId)
                  .OnDelete(DeleteBehavior.Cascade);
            
            entity.HasMany(u => u.OwnedGames)
                  .WithOne(ug => ug.User)
                  .HasForeignKey(ug => ug.UserId)
                  .OnDelete(DeleteBehavior.Cascade);
            
            entity.HasMany(u => u.SentMessages)
                  .WithOne(m => m.Sender)
                  .HasForeignKey(m => m.SenderId)
                  .OnDelete(DeleteBehavior.Restrict);
            
            entity.HasMany(u => u.ReceivedMessages)
                  .WithOne(m => m.Recipient)
                  .HasForeignKey(m => m.RecipientId)
                  .OnDelete(DeleteBehavior.Restrict);
        });

        // ========== Конфигурация Game ==========
        modelBuilder.Entity<Game>(entity =>
        {
            entity.HasIndex(e => e.Genre);
            entity.HasIndex(e => e.Price);
        });

        // ========== Конфигурация Order ==========
        modelBuilder.Entity<Order>(entity =>
        {
            entity.HasIndex(e => e.UserId);
            entity.HasIndex(e => e.CreatedAt);
            
            entity.HasMany(o => o.OrderItems)
                  .WithOne(oi => oi.Order)
                  .HasForeignKey(oi => oi.OrderId)
                  .OnDelete(DeleteBehavior.Cascade);
        });

        // ========== Конфигурация OrderItem ==========
        modelBuilder.Entity<OrderItem>(entity =>
        {
            entity.HasIndex(e => e.OrderId);
            entity.HasIndex(e => e.GameId);
        });

        // ========== Конфигурация Message ==========
        modelBuilder.Entity<Message>(entity =>
        {
            entity.HasIndex(e => e.SenderId);
            entity.HasIndex(e => e.RecipientId);
        });

        // ========== Конфигурация UserGame ==========
        modelBuilder.Entity<UserGame>(entity =>
        {
            entity.HasIndex(e => new { e.UserId, e.GameId }).IsUnique();
        });

        // ========== Конфигурация PaymentTransaction ==========
        modelBuilder.Entity<PaymentTransaction>(entity =>
        {
            entity.HasIndex(e => e.UserId);
            entity.HasIndex(e => e.TransactionDate);
        });

        modelBuilder.Entity<Friendship>(entity =>
        {
            entity.HasKey(e => e.Id);
            entity.HasIndex(e => new { e.UserId, e.FriendId }).IsUnique();
            
            entity.HasOne(e => e.User)
                .WithMany()
                .HasForeignKey(e => e.UserId);
                
            entity.HasOne(e => e.Friend)
                .WithMany()
                .HasForeignKey(e => e.FriendId);
        });

        modelBuilder.Entity<CartItem>(entity =>
{
    entity.HasKey(e => e.Id);
    entity.HasIndex(e => new { e.UserId, e.GameId }).IsUnique();
    
    entity.HasOne(e => e.User)
          .WithMany()
          .HasForeignKey(e => e.UserId)
          .OnDelete(DeleteBehavior.Cascade);
          
    entity.HasOne(e => e.Game)
          .WithMany()
          .HasForeignKey(e => e.GameId)
          .OnDelete(DeleteBehavior.Cascade);
});
    }
}