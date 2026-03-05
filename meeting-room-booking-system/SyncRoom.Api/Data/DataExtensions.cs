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
            options.UseMySql(
                connectionString, 
                ServerVersion.AutoDetect(connectionString)
            ));
    
        return services; 
    }
}