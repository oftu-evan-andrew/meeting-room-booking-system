using System.ComponentModel.DataAnnotations;

namespace SyncRoom.Api.Dto;

public record CreateBookingDto(
    [Required] string Title,
    string? Description,
    DateTime StartTime, 
    DateTime EndTime,
    Guid RoomId
);
