using System.ComponentModel.DataAnnotations;

namespace SyncRoom.Api.Dto;

public record CreateBookingDto(
    [Required] string Title,
    string Description,
    string User,
    DateTime StartTime, 
    DateTime EndTime,
    Guid RoomId
);
