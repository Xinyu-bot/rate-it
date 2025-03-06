using backend.DTOs;

namespace backend.Services
{
    public interface ICommentThreadService
    {
        Task<IEnumerable<CommentThreadDto>> GetAllCommentThreadsAsync(Guid? currentUserId = null);
        Task<IEnumerable<CommentThreadDto>> GetCommentThreadsByEntityIdAsync(Guid entityId, Guid? currentUserId = null);
        Task<IEnumerable<CommentThreadDto>> GetCommentThreadsByUserIdAsync(Guid userId);
        Task<CommentThreadDto?> GetCommentThreadByIdAsync(string id, Guid? currentUserId = null);
        Task<CommentThreadDto> CreateCommentThreadAsync(CreateCommentThreadRequestDto createThreadDto, Guid userId);
        Task<CommentThreadDto> UpdateCommentThreadAsync(string id, UpdateCommentThreadRequestDto updateThreadDto, Guid userId);
        Task<bool> DeleteCommentThreadAsync(string id, Guid userId);
    }
} 