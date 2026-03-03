using System.ComponentModel.DataAnnotations;

namespace SyncRoom.Api.Dto;

public record class RoomSummaryDto(
    string Id, 
    string Name,
    [Required] int Capacity,
    string Amenities,
    List<string> ImageUrls 
);