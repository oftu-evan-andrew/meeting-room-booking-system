using Microsoft.EntityFrameworkCore;
using Microsoft.Extensions.DependencyInjection;

namespace SyncRoom.Api.Data;

public static class DataExtensions
{
    public static IServiceCollection AddDataServices(this IServiceCollection services, 
    IConfiguration configuration)
    {
        var connectionString = configuration.GetConnectionString("DefaultConnection");

        services.AddDbContext<SyncRoomContext>(options => 
            // UseMySQL is the method for the Oracle provider
            options.UseMySQL(connectionString!));
    
        return services; 
    }
}