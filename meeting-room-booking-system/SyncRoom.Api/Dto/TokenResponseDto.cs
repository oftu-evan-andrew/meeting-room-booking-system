using System.ComponentModel.DataAnnotations;

namespace SyncRoom.Api.Dto;

public record TokenResponseDto(
    [Required] string AccessToken, 
    string? RefreshToken
);

