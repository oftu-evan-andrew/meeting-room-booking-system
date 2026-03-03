using System;
using System.ComponentModel.DataAnnotations;

namespace SyncRoom.Api.Dto;

public record LoginUserDto(
    [Required] string Username, 
    [Required] string Password
);
