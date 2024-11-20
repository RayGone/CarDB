using Microsoft.EntityFrameworkCore;
using CarDB_Csharp_API.Models.Entities;

public class CarDBContext : DbContext
{
    private readonly IConfiguration _config;
    public required DbSet<Car> Cars { get; set; }

    public CarDBContext(IConfiguration config){
        _config = config;
    }

    protected override void OnConfiguring(DbContextOptionsBuilder optionsBuilder)
    {
        optionsBuilder.UseSqlServer(_config.GetConnectionString("DefaultConnection"));
    }
}
