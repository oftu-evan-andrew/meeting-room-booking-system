using System.ComponentModel.DataAnnotations;

namespace SyncRoom.Api.Dto;

public record UpdateRoomDto( 
    string Name,
    [Required] int Capacity,
    List<string> Amenities,
    List<string> ExistingImageUrls,
    IFormFileCollection? NewImageFiles  
);

