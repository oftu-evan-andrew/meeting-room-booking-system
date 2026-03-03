namespace SyncRoom.Api.Dto;

public record UserDto(
    int Id,
    string Username, 
    string FirstName, 
    string LastName
);
