using System;
using System.Security.Claims;
using System.Text.Json;
using System.Threading.Tasks;
using backend.DTOs;
using backend.Models;
using backend.Repositories;

namespace backend.Services
{
    public class UserService : IUserService
    {
        private readonly IUserRepository _userRepository;
        private readonly JsonSerializerOptions _jsonOptions;

        public UserService(IUserRepository userRepository)
        {
            _userRepository = userRepository;
            // Configure JSON options (adjust as needed)
            _jsonOptions = new JsonSerializerOptions
            {
                PropertyNameCaseInsensitive = true
            };
        }

        public async Task<UserDetail> GetOrCreateUserAsync(ClaimsPrincipal user)
        {
            // Extract the user_metadata claim from the ClaimsPrincipal
            var userMetadataClaim = user.Claims.FirstOrDefault(c => c.Type == "user_metadata")?.Value;
            if (string.IsNullOrEmpty(userMetadataClaim))
            {
                throw new Exception("Missing user_metadata claim.");
            }

            // Deserialize the claim into a UserMetadata DTO
            var metadata = JsonSerializer.Deserialize<UserMetadata>(userMetadataClaim, _jsonOptions);
            if (metadata == null)
            {
                throw new Exception("Invalid user_metadata JSON.");
            }

            // Delegate to the repository to get or create the user record
            return await _userRepository.GetOrCreateUserAsync(metadata);
        }

        public async Task<UserDetail> GetUserAsync(Guid userId)
        {
            var user = await _userRepository.GetUserAsync(userId) ?? throw new KeyNotFoundException($"User with ID {userId} not found.");
            return user;
        }
    }
}
