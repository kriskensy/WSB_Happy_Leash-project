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
        public DbSet<Pet> Pets { get; set; }
        public DbSet<AdoptionRequest> AdoptionRequests { get; set; }
        public DbSet<PetType> PetTypes { get; set; }
        public DbSet<Breed> Breeds { get; set; }
        public DbSet<HealthRecord> HealthRecords { get; set; }
        public DbSet<Tag> Tags { get; set; }
        public DbSet<PetTag> PetTags { get; set; }

    }
}