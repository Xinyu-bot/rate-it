using System;
using System.Threading.Tasks;
using Microsoft.EntityFrameworkCore;
using backend.Data;
using backend.DTOs;
using backend.Models;

namespace backend.Repositories
{
    public class UserRepository(UserDetailDbContext context) : IUserRepository
    {
        private readonly UserDetailDbContext _context = context;

        public async Task<UserDetail?> GetUserAsync(Guid userId)
        {
            var user = await _context.UserDetails
                .AsNoTracking() // optional: no change tracking TODO: 
                .FirstOrDefaultAsync(u => u.UserId == userId) ?? null;
            return user;
        }

        public async Task<UserDetail> CreateUserAsync(UserDetail userDetail)
        {
            userDetail.CreatedAt = DateTime.UtcNow;
            userDetail.UpdatedAt = DateTime.UtcNow;

            _context.UserDetails.Add(userDetail);
            await _context.SaveChangesAsync();
            return userDetail;
        }

        public async Task<UserDetail> GetOrCreateUserAsync(UserMetadata metadata)
        {
            if (!Guid.TryParse(metadata.Sub, out Guid userId))
            {
                throw new ArgumentException("Invalid user_id in metadata.");
            }

            // Attempt to find existing record
            var existing = await GetUserAsync(userId);
            if (existing != null)
            {
                return existing;
            }

            // If not found, create a new one
            string newUserName = "New_User_" + userId.ToString()[..8] + "_" + DateTime.UtcNow.ToString("yyyyMMddHHmmss");
            var newUser = new UserDetail
            {
                UserId = userId,
                UserName = newUserName,
                UserPointsBalance = 0,
                UserPermission = 1,
                UserStatus = 1 // e.g., active user
                // created_at, updated_at handled in CreateUserAsync
            };

            return await CreateUserAsync(newUser);
        }
    }
}
