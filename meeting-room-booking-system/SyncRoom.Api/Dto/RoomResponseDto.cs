namespace SyncRoom.Api.Dto;

public record RoomResponseDto
(
    Guid Id,
    string Name, 
    int Capacity, 
    List<string> Amenities, 
    List<string> ImageUrls 
);
