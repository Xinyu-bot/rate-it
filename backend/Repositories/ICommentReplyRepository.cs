using backend.Models;

namespace backend.Repositories
{
    public interface ICommentReplyRepository
    {
        Task<IEnumerable<CommentReply>> GetRepliesByThreadIdAsync(string threadId);
        Task<IEnumerable<CommentReply>> GetRepliesByUserIdAsync(Guid userId);
        Task<CommentReply?> GetReplyByIdAsync(string id);
        Task<CommentReply> CreateReplyAsync(CommentReply reply);
        Task<CommentReply> UpdateReplyAsync(CommentReply reply);
        Task<bool> DeleteReplyAsync(string id);
    }
} 