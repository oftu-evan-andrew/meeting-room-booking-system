using SyncRoom.Api.Models;

namespace SyncRoom.Api.Services;

public interface ITokenService
{
    Task<string> CreateToken(User user);
    string CreateRefreshToken();
}
