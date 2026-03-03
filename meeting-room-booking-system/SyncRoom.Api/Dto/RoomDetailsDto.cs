using System.ComponentModel.DataAnnotations;

namespace SyncRoom.Api.Dto;

public record class RoomDetailsDto(
    [Required] string Id, 
    string Name,
    [Required] int Capacity,
    string Ameneties,
    List<Guid> BookingId,
    List<string> ImageUrls 
);
