using System.ComponentModel.DataAnnotations;

namespace SyncRoom.Api.Models;

public class Booking
{
    public Guid Id { get; set; } = Guid.NewGuid();
    public virtual Room? Room { get; set; }
    public Guid RoomId { get; set; } 
    public virtual User? User { get; set; } 
    public Guid UserId { get; set; }
    
    // Change 'required' to 'null!' or make it nullable '?'
    // This tells the compiler: "EF Core will handle this, don't worry about it being null at start"
    
    public DateTime StartTime { get; set;}
    public DateTime EndTime { get; set; }
    public string Title { get; set; } = string.Empty; 
    public string? Description { get; set; }
    public DateTime CreatedAt { get; set; } = DateTime.UtcNow;
    public string? Participants { get; set; }
}