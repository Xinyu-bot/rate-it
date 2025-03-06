using backend.Models;
using NUlid;

namespace backend.Repositories
{
    public class MockCommentReplyRepository : ICommentReplyRepository
    {
        private readonly List<CommentReply> _commentReplies =
        [
            new CommentReply
            {
                CommentReplyId = "01HQ5JTGZJ8GFXZ1PPKR3KYMEJ",
                CommentThreadId = "01HQ5JTGZJ8GFXZ1PPKR3KYMEH",
                ParentReplyId = null,
                UserId = Guid.Parse("55555555-5555-5555-5555-555555555555"),
                Content = "I completely agree with your point!",
                CreatedAt = DateTime.UtcNow.AddDays(-8)
            },
            new CommentReply
            {
                CommentReplyId = "01HQ5JTGZJ8GFXZ1PPKR3KYMEK",
                CommentThreadId = "01HQ5JTGZJ8GFXZ1PPKR3KYMEH",
                ParentReplyId = "01HQ5JTGZJ8GFXZ1PPKR3KYMEJ",
                UserId = Guid.Parse("66666666-6666-6666-6666-666666666666"),
                Content = "That's interesting, but I see it a bit differently.",
                CreatedAt = DateTime.UtcNow.AddDays(-7)
            }
        ];

        public Task<IEnumerable<CommentReply>> GetRepliesByThreadIdAsync(string threadId)
        {
            var replies = _commentReplies.Where(r => r.CommentThreadId == threadId).ToList();
            return Task.FromResult<IEnumerable<CommentReply>>(replies);
        }

        public Task<IEnumerable<CommentReply>> GetRepliesByUserIdAsync(Guid userId)
        {
            var replies = _commentReplies.Where(r => r.UserId == userId).ToList();
            return Task.FromResult<IEnumerable<CommentReply>>(replies);
        }

        public Task<CommentReply?> GetReplyByIdAsync(string id)
        {
            var reply = _commentReplies.FirstOrDefault(r => r.CommentReplyId == id);
            return Task.FromResult(reply);
        }

        public Task<CommentReply> CreateReplyAsync(CommentReply reply)
        {
            if (string.IsNullOrEmpty(reply.CommentReplyId))
            {
                reply.CommentReplyId = Ulid.NewUlid().ToString();
            }
            
            reply.CreatedAt = DateTime.UtcNow;
            
            _commentReplies.Add(reply);
            return Task.FromResult(reply);
        }

        public Task<CommentReply> UpdateReplyAsync(CommentReply reply)
        {
            var existingReply = _commentReplies.FirstOrDefault(r => r.CommentReplyId == reply.CommentReplyId);
            if (existingReply == null)
            {
                throw new KeyNotFoundException($"Comment reply with ID {reply.CommentReplyId} not found");
            }

            existingReply.Content = reply.Content;
            
            return Task.FromResult(existingReply);
        }

        public Task<bool> DeleteReplyAsync(string id)
        {
            var reply = _commentReplies.FirstOrDefault(r => r.CommentReplyId == id);
            if (reply == null)
            {
                return Task.FromResult(false);
            }

            _commentReplies.Remove(reply);
            return Task.FromResult(true);
        }
    }
} 