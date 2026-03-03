using System;
using Microsoft.AspNetCore.Identity;

namespace SyncRoom.Api.Models;

public class User : IdentityUser<Guid>
{
    // It's in IdentityUser<Guid>
    // public Guid Id { get; set; }= Guid.NewGuid();
    // public string PasswordHash { get; set; } = string.Empty;
    // public int AccessFailedCount { get; set; } = 0;
    // public DateTime? LockoutEnd { get; set; } 
    // public required string Username { get; set; }

    public required string FirstName { get; set; }
    public required string LastName { get; set; } 
     
    public ICollection<Booking> Bookings { get; set; } = [];
    public ICollection<SecurityLogging> SecurityLoggings { get; set; } = [];
    public string? RefreshToken { get; set; }
    public DateTime? ExpiryDate { get; set; }
}
