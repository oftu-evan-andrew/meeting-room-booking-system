using System.ComponentModel.DataAnnotations;
using Newtonsoft.Json;

namespace SyncRoom.Api.Dto;

public record  RegisterUserDto(
    [JsonProperty("username")]
    [Required] [StringLength(13)] string Username,

    [JsonProperty("password")]
    [Required] [StringLength(100, MinimumLength = 8, ErrorMessage = "Password must at least be 8 characters long")]
    [RegularExpression(@"^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]{8,}$", 
        ErrorMessage = "Password must contain at least one uppercase letter, one lowercase letter, one number, and one special character.")]
    string Password,

    [JsonProperty("firstName")]
    [Required] string FirstName,
    [JsonProperty("lastName")]
    [Required] string LastName
);
