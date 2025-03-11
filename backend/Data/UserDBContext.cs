using Microsoft.EntityFrameworkCore;
using backend.Models;

namespace backend.Data
{
    public class UserDetailDbContext(DbContextOptions<UserDetailDbContext> options) : DbContext(options)
    {
        public DbSet<UserDetail> UserDetails { get; set; }
        public DbSet<Category> Categories { get; set; }
        public DbSet<Entity> Entities { get; set; }

        protected override void OnModelCreating(ModelBuilder modelBuilder)
        {
            base.OnModelCreating(modelBuilder);
            
            // Configure relationships
            modelBuilder.Entity<Entity>()
                .HasOne<Category>()
                .WithMany()
                .HasForeignKey(e => e.CategoryId);
        }
    }
}
