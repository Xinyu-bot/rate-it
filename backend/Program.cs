using System.Text;
using Microsoft.AspNetCore.Authentication.JwtBearer;
using Microsoft.IdentityModel.Tokens;
using backend.Middleware;
using backend.Repositories;
using backend.Services;
using backend.Data;
using DotNetEnv;
using Microsoft.EntityFrameworkCore;
using System.Security.Principal;

// Load environment variables from the .env file in the root directory
Env.Load();

var builder = WebApplication.CreateBuilder(args);

// Build the connection string from environment variables
var host = Environment.GetEnvironmentVariable("DB_HOST") ?? "PLACE_HOLDER";
var port = Environment.GetEnvironmentVariable("DB_PORT") ?? "5432";
var username = Environment.GetEnvironmentVariable("DB_USERNAME") ?? "PLACE_HOLDER";
var password = Environment.GetEnvironmentVariable("DB_PASSWORD") ?? "PLACE_HOLDER";
var database = Environment.GetEnvironmentVariable("DB_DATABASE") ?? "PLACE_HOLDER";
var connectionString = $"Host={host};Port={port};Username={username};Password={password};Database={database};SSL Mode=Require;Trust Server Certificate=true;";
if (connectionString.Contains("PLACE_HOLDER"))
{
    Console.WriteLine("Error: Database connection string not set");
    Environment.Exit(1);
}

// Register the database context
builder.Services.AddDbContext<UserDetailDbContext>(options =>
    options.UseNpgsql(connectionString));

// Add base services
builder.Services.AddControllers();
builder.Services.AddEndpointsApiExplorer();
builder.Services.AddSwaggerGen();

// Get the ALLOWED_ORIGINS env var, default to empty string if not set
var allowedOrigins = Environment.GetEnvironmentVariable("ALLOWED_ORIGINS") ?? "";

// Split on ';' to handle multiple origins
var originsArray = allowedOrigins
    .Split(';', StringSplitOptions.RemoveEmptyEntries | StringSplitOptions.TrimEntries);

builder.Services.AddCors(options =>
{
    options.AddPolicy("AllowFrontend", policy =>
    {
        // policy.WithOrigins(originsArray)
        policy.AllowAnyOrigin()
        .AllowAnyHeader()
        .AllowAnyMethod();
    });
});

// Register repositories
builder.Services.AddScoped<IUserRepository, UserRepository>();
builder.Services.AddScoped<ICategoryRepository, MockCategoryRepository>();
builder.Services.AddScoped<IEntityRepository, MockEntityRepository>();
builder.Services.AddScoped<ICommentThreadRepository, MockCommentThreadRepository>();
builder.Services.AddScoped<ICommentReplyRepository, MockCommentReplyRepository>();
builder.Services.AddScoped<IVoteRepository, MockVoteRepository>();

// Register services
builder.Services.AddScoped<IUserService, UserService>();
builder.Services.AddScoped<ICategoryService, CategoryService>();
builder.Services.AddScoped<IEntityService, EntityService>();
builder.Services.AddScoped<ICommentThreadService, CommentThreadService>();
builder.Services.AddScoped<ICommentReplyService, CommentReplyService>();
builder.Services.AddScoped<IVoteService, VoteService>();

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

// BUILD THE APP
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
