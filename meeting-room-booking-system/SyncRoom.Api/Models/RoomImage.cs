using System;
using System.Text.Json.Serialization;

namespace SyncRoom.Api.Models;

public class RoomImage
{
    public Guid Id {get; set; } = Guid.NewGuid();
    public string Url { get; set; } = string.Empty; 
    public string AltText { get; set; } = string.Empty; 
    
    public Guid RoomId { get; set; } 
    
    [JsonIgnore]
    public Room Room { get; set; } = null!;
}
