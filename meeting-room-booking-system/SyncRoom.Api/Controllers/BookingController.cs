using System.Security.Claims;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Http;
using Microsoft.AspNetCore.Identity;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using SyncRoom.Api.Data;
using SyncRoom.Api.Dto;
using SyncRoom.Api.Models;

namespace SyncRoom.Api.Controllers
{
    [Route("api/[controller]")]
    [ApiController]
    public class BookingController (SyncRoomContext context) : ControllerBase
    {
        [Authorize]
        [HttpPost("create")]
        public async Task<IActionResult> CreateBooking([FromBody] CreateBookingDto createBookingDto)
        {
            var room = await context.Rooms.FindAsync(createBookingDto.RoomId);
           
            if (room is null) return NotFound("The requested room does not exist.");

            var userId = User.FindFirstValue(ClaimTypes.NameIdentifier);

            bool isOverlapping = await context.Bookings.AnyAsync(b => 
                b.RoomId == createBookingDto.RoomId && 
                b.StartTime < createBookingDto.EndTime && 
                b.EndTime > createBookingDto.StartTime
            );
            

            if (!Guid.TryParse(userId, out Guid userIdGuid))
                return Unauthorized();

            if (isOverlapping) return Conflict( new { Message = "Room is already booked for this time slot."});

            var newBooking = new Booking
            {
                Title = createBookingDto.Title,
                Description = createBookingDto.Description,
                UserId = userIdGuid,
                StartTime = createBookingDto.StartTime,
                EndTime = createBookingDto.EndTime,
                RoomId = createBookingDto.RoomId,
            };

            context.Bookings.Add(newBooking);
            await context.SaveChangesAsync();

            return Ok();
        }
        [Authorize]
        [HttpDelete("{id}")]
        public async Task<IActionResult> DeleteBookings(Guid Id) {
            var booking = await context.Bookings.FindAsync(Id);

            if (booking is null) return NotFound("Booking does not exist");

            context.Bookings.Remove(booking);
            await context.SaveChangesAsync();

            return NoContent();
        }
    }
}
