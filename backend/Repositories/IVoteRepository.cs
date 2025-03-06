using backend.Models;

namespace backend.Repositories
{
    public interface IVoteRepository
    {
        Task<IEnumerable<Vote>> GetVotesByUserIdAsync(Guid userId);
        Task<Vote?> GetVoteByUserAndThreadIdAsync(Guid userId, string threadId);
        Task<Vote> CreateVoteAsync(Vote vote);
        Task<Vote> UpdateVoteAsync(Vote vote);
        Task<bool> DeleteVoteAsync(string id);
    }
} 