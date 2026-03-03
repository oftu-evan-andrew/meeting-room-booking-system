using Microsoft.AspNetCore.Identity;
using Microsoft.AspNetCore.Identity.EntityFrameworkCore;
using Microsoft.EntityFrameworkCore;
using SyncRoom.Api.Models;

namespace SyncRoom.Api.Data;

public class SyncRoomContext(DbContextOptions<SyncRoomContext> options) : IdentityDbContext<User, IdentityRole<Guid>, Guid>(options)
{
    public DbSet<Room> Rooms => Set<Room>();
    // public DbSet<User> Users => Set<User>(); In IdentityDb now.
    public DbSet<Booking> Bookings => Set<Booking>();
    public DbSet<SecurityLogging> SecurityLoggings => Set<SecurityLogging>();
    public DbSet<RoomImage> RoomImages => Set<RoomImage>();

    protected override void OnModelCreating(ModelBuilder modelBuilder)
    {   
        base.OnModelCreating(modelBuilder);

        modelBuilder.Entity<Room>().HasQueryFilter(r => !r.IsDeleted);

        modelBuilder.Entity<Booking>(entity => {
            // Filters deleted rooms.
            entity.HasQueryFilter(b => !b.Room!.IsDeleted);
            
            // Relation with Room
            entity.HasOne(b => b.Room)
                .WithMany(r => r.Bookings)
                .HasForeignKey(b => b.RoomId)
                .OnDelete(DeleteBehavior.Restrict);

            // Relation with User
            entity.HasOne(b => b.User)
                .WithMany(u => u.Bookings)
                .HasForeignKey(b => b.UserId);
        });

        modelBuilder.Entity<RoomImage>(entity => {
            entity.HasOne(i => i.Room)
                .WithMany(r => r.Images)
                .HasForeignKey(i => i.RoomId);

            // Filters out deleted rooms.
            entity.HasQueryFilter(i => !i.Room!.IsDeleted); 
        });

        modelBuilder.Entity<SecurityLogging>(entity =>
        {
            entity.HasOne(s => s.User)
            .WithMany(u => u.SecurityLoggings)
            .HasForeignKey(s => s.UserId);

            // For query search.
            entity.HasIndex(s => s.UserId);
            entity.HasIndex(s => s.Timestamps);
        });
    }
}
