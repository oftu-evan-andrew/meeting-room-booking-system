using System.Security.Claims;
using Microsoft.AspNetCore.Authentication.JwtBearer;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Http;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using SyncRoom.Api.Data;
using SyncRoom.Api.Dto;
using SyncRoom.Api.Models;

namespace SyncRoom.Api.Controllers
{
    [Route("api/[controller]")]
    [ApiController]
    public class RoomController(SyncRoomContext context) : ControllerBase
    {
        [Authorize]
        [HttpGet]
        public async Task<IActionResult> FetchAllRooms()
        {
            var rooms = await context.Rooms
            .Where(r => !r.IsDeleted && r.IsActive)
            .Select(r => new RoomSummaryDto
            (
                r.Id.ToString(),
                r.Name,
                r.Capacity,
                r.Amenities,
                r.Images.Select(i => i.Url).ToList()
            ))
            .ToListAsync();

            return Ok(rooms);
        }

        [Authorize]
        [HttpGet("{id}")]
        public async Task<IActionResult> FetchRoomById(Guid id) 
        {
            var roomDetails = await context.Rooms.Where(r => r.Id == id && !r.IsDeleted)
            .Select(r => new RoomDetailsDto (
                r.Id.ToString(),
                r.Name,
                r.Capacity,
                r.Amenities,
                r.Bookings.Select(b => b.Id).ToList(),
                r.Images.Select(i => i.Url).ToList()
            )).SingleOrDefaultAsync();

            if (roomDetails is null) return NotFound("Room does not exist");

            return Ok(roomDetails);
        }

        [Authorize(Roles = "SuperAdmin")]
        [HttpPost("create")]
        public async Task<IActionResult> CreateRoom([FromForm] CreateRoomDto createRoomDto)
        {

            var newRoom = new Room
            {
                Name = createRoomDto.Name,
                Capacity = createRoomDto.Capacity,
                Amenities = string.Join(", ", createRoomDto.Amenities),
            };

            foreach (var file in createRoomDto.ImageFiles)
            {
                var fileName = $"{Guid.NewGuid()}{Path.GetExtension(file.FileName)}";
                var folderPath = Path.Combine(Directory.GetCurrentDirectory(), "wwwroot", "uploads");

                if (!Directory.Exists(folderPath)) Directory.CreateDirectory(folderPath);

                var filePath = Path.Combine(folderPath, fileName);

                using (var stream = new FileStream(filePath, FileMode.Create))
                {
                    await file.CopyToAsync(stream);
                }

                newRoom.Images.Add(new RoomImage
                {
                   Url = $"/uploads/{fileName}",
                   AltText = $"{newRoom.Name} Image" 
                });
            }

            context.Rooms.Add(newRoom);
            await context.SaveChangesAsync();

            var dto = new RoomSummaryDto(
                newRoom.Id.ToString(),
                newRoom.Name,
                newRoom.Capacity,
                newRoom.Amenities,
                newRoom.Images.Select(i => i.Url).ToList()
            );

            return Ok(dto);
        }

        [Authorize(Roles = "SuperAdmin")]
        [HttpDelete("{id}")]
        public async Task<IActionResult> DeleteRoom(Guid id)
        {
            var room = await context.Rooms.FindAsync(id);

            if (room is null) return NotFound();

            room.IsDeleted = true;
            room.IsActive = false;

            await context.SaveChangesAsync();

            return NoContent();
        }

        [Authorize(Roles = "SuperAdmin")]
        [HttpPut("{id}")]
        public async Task<IActionResult> UpdateRoom(Guid id, [FromForm] UpdateRoomDto updateRoomDto)
        {
            var room = await context.Rooms.Include(r => r.Images).FirstOrDefaultAsync(r => r.Id == id);
            if (room is null) return NotFound();

            room.Name = updateRoomDto.Name;
            room.Capacity = updateRoomDto.Capacity;
            room.Amenities = string.Join(", ", updateRoomDto.Amenities);

            var filesToDelete = new List<string>();

            var imagesToRemove = room.Images
                .Where(img => !updateRoomDto.ExistingImageUrls.Contains(img.Url))
                .ToList();

            foreach (var img in imagesToRemove)
            {
                // Constructs the path to the physical file
                var filePath = Path.Combine(Directory.GetCurrentDirectory(), "wwwroot", img.Url.TrimStart('/'));
                
                // Delete the physical file from the disk if it exists
                if (System.IO.File.Exists(filePath))
                {
                   filesToDelete.Add(filePath);
                }

                context.RoomImages.Remove(img);

            }

            if (updateRoomDto.NewImageFiles != null)
            {
                foreach (var file in updateRoomDto.NewImageFiles)
                {
                    var fileName = $"{Guid.NewGuid()}{Path.GetExtension(file.FileName)}";
                    var filePath = Path.Combine(Directory.GetCurrentDirectory(), "wwwroot/uploads", fileName);

                    using (var stream = new FileStream(filePath, FileMode.Create))
                     await file.CopyToAsync(stream);

                    room.Images.Add(new RoomImage { Url = $"/uploads/{fileName}"});
                }
            } 

            await context.SaveChangesAsync();
            return Ok("Room updated successfully with new and existing images");  
        }
    }
}
