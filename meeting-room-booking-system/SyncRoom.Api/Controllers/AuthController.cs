using System.IdentityModel.Tokens.Jwt;
using System.Security.Claims;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Http;
using Microsoft.AspNetCore.Identity;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using SyncRoom.Api.Data;
using SyncRoom.Api.Dto;
using SyncRoom.Api.Models;
using SyncRoom.Api.Services;

namespace SyncRoom.Api.Controllers
{
    [Route("api/[controller]")]
    [ApiController]
    public class AuthController(
     SyncRoomContext context,
     IPasswordHasher<User> passwordHasher,
     ITokenService tokenService, UserManager<User> userManager) : ControllerBase
    {
        // Log account activity.
        private async Task LogSecurityEvent(Guid userId, bool isSuccess, string? reason, string eventType)
        {
            var log = new SecurityLogging
            {
                Id = Guid.NewGuid(),
                UserId = userId == Guid.Empty ? null : userId,
                Timestamps = DateTime.UtcNow,
                IsSuccessful = isSuccess, 
                IpAddress = HttpContext.Connection.RemoteIpAddress?.ToString() ?? "Unknown",
                FailureReason = reason,
                EventType = eventType
            };

            context.SecurityLoggings.Add(log);
            await context.SaveChangesAsync();
        }

        [HttpPost("register")]
        public async Task<IActionResult> Register([FromBody] RegisterUserDto registerUserDto)
        {   
            var existingUser = await userManager.FindByNameAsync(registerUserDto.Username);
            if (existingUser is not null) {
                
                await LogSecurityEvent(Guid.Empty, true, "Username already exist", "Register Attempt");
                return BadRequest(new { Message = "Username already exist" });     
            }

            var newUser = new User
            { 
                UserName = registerUserDto.Username,
                FirstName = registerUserDto.FirstName, 
                LastName = registerUserDto.LastName, 
            };

            var result = await userManager.CreateAsync(newUser, registerUserDto.Password);

            if (!result.Succeeded)
            {
                await LogSecurityEvent(Guid.Empty, false, "Identity Creation Failed", "Register Attempt");
                return BadRequest(result.Errors);
            }

            await LogSecurityEvent(newUser.Id, true, "User registered successfully", "Register");

            return Ok(new { message = "Registration successful" });
        }

        [HttpPost("login")]
        public async Task<IActionResult> Login([FromBody] LoginUserDto loginUserDto)
        {
            if (!ModelState.IsValid ) return BadRequest(ModelState);

            var user = await  userManager.FindByNameAsync(loginUserDto.Username);
            if (user == null) return Unauthorized("Invalid username or password");

            // Lockout user if LockoutEnd has value
            if (user.LockoutEnd.HasValue && user.LockoutEnd > DateTime.UtcNow)
            {
                var remaining = user.LockoutEnd.Value - DateTime.UtcNow;
                return StatusCode(423, new { Message = $"Too much log in attempts. Try again later."});
            }

            if (user.LockoutEnd == default && user.LockoutEnd <= DateTime.UtcNow)
            {
                user.AccessFailedCount = 0;
                user.LockoutEnd = null;
                await context.SaveChangesAsync();
            }

            var result = passwordHasher.VerifyHashedPassword(user, user.PasswordHash!, loginUserDto.Password);
            
            // If wrong password, increment AccessFailedCount
            if (result == PasswordVerificationResult.Failed)
            {
                user.AccessFailedCount++;
                
                if (user.AccessFailedCount >= 5)
                {
                    user.LockoutEnd = DateTime.UtcNow.AddMinutes(30);
                }
                await LogSecurityEvent(user.Id, false, "Invalid username or password", "Log in attempt");
                await context.SaveChangesAsync();
                return Unauthorized(new {Message = "Invalid username or password"});
            }    

            string token = await tokenService.CreateToken(user);

            Response.Cookies.Append("jwt_session", token, new CookieOptions
            {
                HttpOnly = true, 
                Secure = false, 
                SameSite = SameSiteMode.Lax,
                Expires = DateTime.UtcNow.AddMinutes(30)
            });

            string refreshToken = tokenService.CreateRefreshToken();
            var expiryTime = DateTime.UtcNow.AddDays(7);

            user.RefreshToken = refreshToken;
            user.ExpiryDate = expiryTime; 
            
            Response.Cookies.Append("refresh_token" , refreshToken, new CookieOptions {
                HttpOnly = true, 
                Secure = false, 
                SameSite = SameSiteMode.Lax,
                Expires = expiryTime,
                Path = "/"
            });

            var roles = await userManager.GetRolesAsync(user);
            var primaryRole = roles.FirstOrDefault();

            await LogSecurityEvent(user.Id, true, null, "Logged in");
            user.AccessFailedCount = 0;
            user.LockoutEnd = null;
            return Ok(new {
                Message = "Logged in successfully", 
                Id = User.FindFirst("sub")?.Value,
                user.UserName, 
                user.FirstName,
                user.LastName,
                Role = primaryRole
            });
        }
        
        [Authorize]
        [HttpGet("profile")]
        public async Task<IActionResult> GetProfile()
        {
            var userId = User.FindFirst(System.Security.Claims.ClaimTypes.NameIdentifier)?.Value ?? User.FindFirst("sub")?.Value;

            if (string.IsNullOrEmpty(userId)) return Unauthorized();

            var user = await userManager.FindByIdAsync(userId);

            if (user is null)
            {
                return NotFound("User not found in the database");
            }

            return Ok(new
            {
                Id = userId, 
                user.UserName,
                user.Email,
                user.FirstName, 
                user.LastName,
                Role = User.FindFirst("role")?.Value 
            });
        }

        [HttpPost("refresh")]
        public async Task<IActionResult> Refresh( )
        {
            var refreshToken = Request.Cookies["refresh_token"];

            var user = await context.Users.FirstOrDefaultAsync(u => u.RefreshToken == refreshToken);

            if (user == null || user.ExpiryDate < DateTime.UtcNow)
            {
                return Unauthorized("Refresh token has expired. Please log in again");
            }            

            string token = await tokenService.CreateToken(user);

            Response.Cookies.Append("jwt_session", token, new CookieOptions
            {
                HttpOnly = true,
                Secure = false, 
                SameSite = SameSiteMode.Lax, 
                Expires = DateTime.UtcNow.AddMinutes(30),
                Path = "/"
            });
            
            var newRefreshToken = tokenService.CreateRefreshToken();
            var expiryTime = DateTime.UtcNow.AddDays(7);

            Response.Cookies.Append("refresh_token", newRefreshToken, new CookieOptions
            {
                HttpOnly = true,
                Secure = false, 
                SameSite = SameSiteMode.Lax, 
                Expires = expiryTime
            });
            
            user.RefreshToken = newRefreshToken;
            user.ExpiryDate = expiryTime;
            await context.SaveChangesAsync();
            return Ok();
        }
        
        [HttpPost("logout")]
        // Allow anonymous so expired tokens don't block the cleanup
        public async Task<IActionResult> Logout()
        {
            // Try to get the ID from 'sub' (matching your current TokenService)
            var userIdClaim = User.FindFirstValue(JwtRegisteredClaimNames.Sub);

            if (Guid.TryParse(userIdClaim, out var userId))
            {
                var user = await context.Users.FindAsync(userId);
                if (user is not null)
                {
                    await LogSecurityEvent(user.Id, true, null, "Logout");
                    user.RefreshToken = null;
                    user.ExpiryDate = null;
                    await context.SaveChangesAsync();
                }
            }

            // Always kill the cookies!
            var cookieOptions = new CookieOptions { HttpOnly = true, Secure = true };
            Response.Cookies.Delete("jwt_session", cookieOptions);
            Response.Cookies.Delete("refresh_token", cookieOptions);

            return Ok(new { Message = "Logged out successfully" });
        }
    }
}
