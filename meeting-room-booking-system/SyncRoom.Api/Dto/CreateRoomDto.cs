using System.ComponentModel.DataAnnotations;

namespace SyncRoom.Api.Dto;

public record CreateRoomDto( 
    string Name,
    [Required] int Capacity,
    List<string> Amenities,
    IFormFileCollection ImageFiles 
);

