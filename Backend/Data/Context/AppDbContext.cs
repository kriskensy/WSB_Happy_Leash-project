using Microsoft.EntityFrameworkCore;
using WSB_Happy_Leash_project.Data.Models;
namespace WSB_Happy_Leash_project.Data.Context
{
    public class AppDbContext : DbContext
    {
        public AppDbContext(DbContextOptions<AppDbContext> options)
            : base(options)
        {
        }
        public DbSet<User> Users { get; set; }
    }
}