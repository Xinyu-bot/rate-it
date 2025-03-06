using backend.Models;

namespace backend.Repositories
{
    public interface ICommentThreadRepository
    {
        Task<IEnumerable<CommentThread>> GetAllCommentThreadsAsync();
        Task<IEnumerable<CommentThread>> GetCommentThreadsByEntityIdAsync(Guid entityId);
        Task<IEnumerable<CommentThread>> GetCommentThreadsByUserIdAsync(Guid userId);
        Task<CommentThread?> GetCommentThreadByIdAsync(string id);
        Task<CommentThread> CreateCommentThreadAsync(CommentThread commentThread);
        Task<CommentThread> UpdateCommentThreadAsync(CommentThread commentThread);
        Task<bool> DeleteCommentThreadAsync(string id);
        Task<bool> UpdateVoteCountsAsync(string id, int upvoteDelta, int downvoteDelta);
        Task<bool> IncrementRepliesCountAsync(string id);
    }
} 