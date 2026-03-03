namespace SyncRoom.Api.Models;

public class SecurityLogging
{
    public Guid Id { get; set; } = new Guid();
    public User? User { get; set; }
    public Guid? UserId { get; set; } = new Guid();
    public DateTime Timestamps { get; set; }
    public bool IsSuccessful { get; set; }
    public string? IpAddress { get; set; }
    public string? FailureReason { get; set; }
    public string? EventType { get; set; }
}
