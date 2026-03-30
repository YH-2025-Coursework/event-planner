using Microsoft.EntityFrameworkCore;

namespace EventPlanner.Api.Data;

public class AppDbContext : DbContext
{
    public AppDbContext(DbContextOptions<AppDbContext> options) : base(options)
    {
    }
    
    // here we will add DbSet properties for our entities, for example:
}