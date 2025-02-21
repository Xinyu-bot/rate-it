using Microsoft.EntityFrameworkCore;
using backend.Models;

namespace backend.Data
{
    public class UserDetailDbContext(DbContextOptions<UserDetailDbContext> options) : DbContext(options)
    {

        public DbSet<UserDetail> UserDetails { get; set; }

        protected override void OnModelCreating(ModelBuilder modelBuilder)
        {
            base.OnModelCreating(modelBuilder);
        }
    }
}
