using Microsoft.AspNetCore.Identity;
using Microsoft.IdentityModel.Tokens;
using SyncRoom.Api.Data;
using SyncRoom.Api.Models;
using SyncRoom.Api.Services;
using Microsoft.AspNetCore.Authentication.JwtBearer;
using System.Security.Claims;
using System.Text;
using System.IdentityModel.Tokens.Jwt;
using System.Net;
using System.Text.Json;

JwtSecurityTokenHandler.DefaultInboundClaimTypeMap.Clear();

var builder = WebApplication.CreateBuilder(args);

builder.Services.AddCors(options =>
{
    options.AddPolicy("AllowReactApp", policy =>
    {
        policy.WithOrigins(
            "http://localhost:5173",
            "https://meeting-room-booking-system-sable.vercel.app"
        )
        .AllowAnyHeader()
        .AllowAnyMethod()
        .AllowCredentials();
    });
});

var jwtKey = builder.Configuration["Jwt:Key"];

builder.Services.AddControllers()
    .AddJsonOptions(options =>
    {
        options.JsonSerializerOptions.PropertyNamingPolicy = JsonNamingPolicy.CamelCase;
    });

builder.Services.AddScoped<IPasswordHasher<User>, PasswordHasher<User>>();

builder.Services.AddIdentity<User, IdentityRole<Guid>>(options => 
{
    options.SignIn.RequireConfirmedAccount = false; 
    options.SignIn.RequireConfirmedEmail = false;

    options.ClaimsIdentity.RoleClaimType = "role";
    options.ClaimsIdentity.UserIdClaimType = "sub";
})
.AddEntityFrameworkStores<SyncRoomContext>()
.AddDefaultTokenProviders();

builder.Services.AddTransient<ITokenService, TokenService>();

// Validates incoming JWT tokens. 
builder.Services.AddAuthentication(options => 
{
    options.DefaultAuthenticateScheme = JwtBearerDefaults.AuthenticationScheme;
    options.DefaultChallengeScheme = JwtBearerDefaults.AuthenticationScheme;
    options.DefaultScheme = JwtBearerDefaults.AuthenticationScheme;
})
.AddJwtBearer(options =>
{
    
    options.MapInboundClaims = false; 

    options.TokenValidationParameters = new TokenValidationParameters
    {
        ValidateIssuer = true,
        ValidateAudience = true,
        ValidateLifetime = true, 
        ValidateIssuerSigningKey = true,
        ValidIssuer = builder.Configuration["Jwt:Issuer"],
        ValidAudience = builder.Configuration["Jwt:Audience"],
        IssuerSigningKey = new SymmetricSecurityKey(
            Convert.FromBase64String(builder.Configuration["Jwt:Key"]!)
        ),

        // FIX 2: These MUST match your TokenService JSON keys exactly
        RoleClaimType = "role",
        NameClaimType = "sub",

        ClockSkew = TimeSpan.Zero
    };

    options.Events = new JwtBearerEvents
    {
        OnMessageReceived = context =>
        {
            context.Token = context.Request.Cookies["jwt_session"];
            return Task.CompletedTask;
        },
    };
});

builder.Services.AddAuthorization();

// Data Extension
builder.Services.AddDataServices(builder.Configuration);

var app = builder.Build();

app.UseStaticFiles();

app.UseRouting(); 

app.UseCors("AllowReactApp");

app.UseAuthentication();
app.UseAuthorization();

app.MapControllers();

app.Run();


