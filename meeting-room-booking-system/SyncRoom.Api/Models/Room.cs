using System.ComponentModel.DataAnnotations;

namespace SyncRoom.Api.Models;

public class Room
{
    public Guid Id { get; set; } = Guid.NewGuid();

    [Required]
    [MaxLength(100)]
    public required string Name { get; set; } = string.Empty; 
    public int Capacity { get; set; }
    public string Amenities { get; set; } = string.Empty; 
    public string Location { get; set; } = string.Empty;
    public bool IsActive { get; set; } = true;
    public bool IsDeleted { get; set; } = false;
    public ICollection<Booking> Bookings { get; set; } = [];
    public ICollection<RoomImage> Images { get; set; } = [] ;
}
