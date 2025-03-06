using backend.Models;
using NUlid;

namespace backend.Repositories
{
    public class MockCommentThreadRepository : ICommentThreadRepository
    {
        private readonly List<CommentThread> _commentThreads =
        [
            new CommentThread
            {
                CommentThreadId = "01HQ5JTGZJ8GFXZ1PPKR3KYMEH",
                EntityId = Guid.Parse("11111111-1111-1111-1111-111111111111"),
                UserId = Guid.Parse("33333333-3333-3333-3333-333333333333"),
                Rating = 5,
                Content = "This place is amazing! I had a fantastic experience.",
                CreatedAt = DateTime.UtcNow.AddDays(-10),
                UpvoteCount = 10,
                DownvoteCount = 1,
                RepliesCount = 2
            },
            new CommentThread
            {
                CommentThreadId = "01HQ5JTGZJ8GFXZ1PPKR3KYMEI",
                EntityId = Guid.Parse("11111111-1111-1111-1111-111111111111"),
                UserId = Guid.Parse("44444444-4444-4444-4444-444444444444"),
                Rating = 4,
                Content = "Really enjoyed the service, will definitely visit again.",
                CreatedAt = DateTime.UtcNow.AddDays(-9),
                UpvoteCount = 7,
                DownvoteCount = 0,
                RepliesCount = 1
            }
        ];

        public Task<IEnumerable<CommentThread>> GetAllCommentThreadsAsync()
        {
            return Task.FromResult<IEnumerable<CommentThread>>(_commentThreads);
        }

        public Task<IEnumerable<CommentThread>> GetCommentThreadsByEntityIdAsync(Guid entityId)
        {
            var threads = _commentThreads.Where(t => t.EntityId == entityId).ToList();
            return Task.FromResult<IEnumerable<CommentThread>>(threads);
        }

        public Task<IEnumerable<CommentThread>> GetCommentThreadsByUserIdAsync(Guid userId)
        {
            var threads = _commentThreads.Where(t => t.UserId == userId).ToList();
            return Task.FromResult<IEnumerable<CommentThread>>(threads);
        }

        public Task<CommentThread?> GetCommentThreadByIdAsync(string id)
        {
            var thread = _commentThreads.FirstOrDefault(t => t.CommentThreadId == id);
            return Task.FromResult(thread);
        }

        public Task<CommentThread> CreateCommentThreadAsync(CommentThread commentThread)
        {
            if (string.IsNullOrEmpty(commentThread.CommentThreadId))
            {
                commentThread.CommentThreadId = Ulid.NewUlid().ToString();
            }
            
            commentThread.CreatedAt = DateTime.UtcNow;
            
            _commentThreads.Add(commentThread);
            return Task.FromResult(commentThread);
        }

        public Task<CommentThread> UpdateCommentThreadAsync(CommentThread commentThread)
        {
            var existingThread = _commentThreads.FirstOrDefault(t => t.CommentThreadId == commentThread.CommentThreadId);
            if (existingThread == null)
            {
                throw new KeyNotFoundException($"Comment thread with ID {commentThread.CommentThreadId} not found");
            }

            existingThread.Content = commentThread.Content;
            existingThread.Rating = commentThread.Rating;
            
            return Task.FromResult(existingThread);
        }

        public Task<bool> DeleteCommentThreadAsync(string id)
        {
            var thread = _commentThreads.FirstOrDefault(t => t.CommentThreadId == id);
            if (thread == null)
            {
                return Task.FromResult(false);
            }

            _commentThreads.Remove(thread);
            return Task.FromResult(true);
        }

        public Task<bool> UpdateVoteCountsAsync(string id, int upvoteDelta, int downvoteDelta)
        {
            var thread = _commentThreads.FirstOrDefault(t => t.CommentThreadId == id);
            if (thread == null)
            {
                return Task.FromResult(false);
            }

            thread.UpvoteCount += upvoteDelta;
            thread.DownvoteCount += downvoteDelta;
            
            return Task.FromResult(true);
        }

        public Task<bool> IncrementRepliesCountAsync(string id)
        {
            var thread = _commentThreads.FirstOrDefault(t => t.CommentThreadId == id);
            if (thread == null)
            {
                return Task.FromResult(false);
            }

            thread.RepliesCount++;
            
            return Task.FromResult(true);
        }
    }
} 