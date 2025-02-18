using System.Text;
using Microsoft.AspNetCore.Authentication.JwtBearer;
using Microsoft.IdentityModel.Tokens;
using backend.Middleware;
using backend.Repositories;
using backend.Services;

using DotNetEnv;

// Load environment variables from the .env file in the root directory
Env.Load();

var builder = WebApplication.CreateBuilder(args);

// Add base services
builder.Services.AddControllers();
builder.Services.AddEndpointsApiExplorer();
builder.Services.AddSwaggerGen();

// Get the ALLOWED_ORIGINS env var, default to empty string if not set
var allowedOrigins = Environment.GetEnvironmentVariable("ALLOWED_ORIGINS") ?? "";

// Split on ';' (or commas) to handle multiple origins
var originsArray = allowedOrigins
    .Split(';', StringSplitOptions.RemoveEmptyEntries | StringSplitOptions.TrimEntries);

builder.Services.AddCors(options =>
{
    options.AddPolicy("AllowFrontend", policy =>
    {
        policy.WithOrigins(originsArray)
        .AllowAnyHeader()
        .AllowAnyMethod();
    });
});

// Register your dependencies
builder.Services.AddScoped<IWeatherRepository, WeatherRepository>();
builder.Services.AddScoped<IWeatherService, WeatherService>();

// Configure JWT authentication
var jwtSection = builder.Configuration.GetSection("Jwt");
var key = Encoding.UTF8.GetBytes(jwtSection["Key"] ?? "fallback_secret");

builder.Services
    .AddAuthentication(options =>
    {
        options.DefaultAuthenticateScheme = JwtBearerDefaults.AuthenticationScheme;
        options.DefaultChallengeScheme = JwtBearerDefaults.AuthenticationScheme;
    })
    .AddJwtBearer(options =>
    {
        options.TokenValidationParameters = new TokenValidationParameters
        {
            ValidateIssuerSigningKey = true,
            IssuerSigningKey = new SymmetricSecurityKey(key),
            ValidateIssuer = true,
            ValidIssuer = jwtSection["Issuer"],
            ValidateAudience = true,
            ValidAudience = jwtSection["Audience"],
            ValidateLifetime = true
        };
    });

// var jwtKey = jwtSection["Key"];
// var jwtIssuer = jwtSection["Issuer"];
// var jwtAudience = jwtSection["Audience"];
// Console.WriteLine($"JWT Key: {jwtKey}");
// Console.WriteLine($"JWT Issuer: {jwtIssuer}");
// Console.WriteLine($"JWT Audience: {jwtAudience}");

var app = builder.Build();

app.UseCors("AllowFrontend");

// Custom logging middleware
app.UseMiddleware<LoggingMiddleware>();
app.UseLoggingMiddleware();

// Swagger in dev
if (app.Environment.IsDevelopment())
{
    app.UseSwagger();
    app.UseSwaggerUI();
}

app.UseHttpsRedirection();

// Add authentication & authorization middleware
app.UseAuthentication();
app.UseAuthorization();

// Map controllers
app.MapControllers();

app.Run();
