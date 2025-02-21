using System.Security.Claims;
using backend.Models;

namespace backend.Services
{
    public interface IUserService
    {
        Task<UserDetail> GetOrCreateUserAsync(ClaimsPrincipal metadata);
    }
}
