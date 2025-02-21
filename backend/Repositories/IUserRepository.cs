using System;
using System.Threading.Tasks;
using backend.DTOs;
using backend.Models;

namespace backend.Repositories
{
    public interface IUserRepository
    {
        Task<UserDetail?> GetUserAsync(Guid userId);
        Task<UserDetail> CreateUserAsync(UserDetail userDetail);
        Task<UserDetail> GetOrCreateUserAsync(UserMetadata metadata);
    }
}
