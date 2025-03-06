using backend.DTOs;

namespace backend.Services
{
    public interface ICommentReplyService
    {
        Task<IEnumerable<CommentReplyDto>> GetRepliesByThreadIdAsync(string threadId);
        Task<IEnumerable<CommentReplyDto>> GetRepliesByUserIdAsync(Guid userId);
        Task<CommentReplyDto?> GetReplyByIdAsync(string id);
        Task<CommentReplyDto> CreateReplyAsync(CreateCommentReplyRequestDto createReplyDto, Guid userId);
        Task<CommentReplyDto> UpdateReplyAsync(string id, UpdateCommentReplyRequestDto updateReplyDto, Guid userId);
        Task<bool> DeleteReplyAsync(string id, Guid userId);
    }
} 