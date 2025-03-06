using backend.DTOs;

namespace backend.Services
{
    public interface IVoteService
    {
        Task<IEnumerable<VoteDto>> GetVotesByUserIdAsync(Guid userId);
        Task<VoteDto?> GetVoteByUserAndThreadIdAsync(Guid userId, string threadId);
        Task<VoteDto> CreateOrUpdateVoteAsync(CreateVoteRequestDto createVoteDto, Guid userId);
        Task<bool> DeleteVoteAsync(string threadId, Guid userId);
    }
} 