using backend.Models;
using backend.Data;
using MongoDB.Driver;
using System;
using System.Collections.Generic;
using System.Threading.Tasks;

namespace backend.Repositories
{
    public class CommentThreadRepository : ICommentThreadRepository
    {
        private readonly IMongoCollection<CommentThread> _commentThreads;

        public CommentThreadRepository(MongoDBContext context)
        {
            _commentThreads = context.CommentThreads;
        }

        public async Task<IEnumerable<CommentThread>> GetAllCommentThreadsAsync()
        {
            return await _commentThreads.Find(_ => true).ToListAsync();
        }

        public async Task<IEnumerable<CommentThread>> GetCommentThreadsByEntityIdAsync(Guid entityId)
        {
            var filter = Builders<CommentThread>.Filter.Eq(c => c.EntityId, entityId);
            return await _commentThreads.Find(filter).ToListAsync();
        }

        public async Task<IEnumerable<CommentThread>> GetCommentThreadsByUserIdAsync(Guid userId)
        {
            var filter = Builders<CommentThread>.Filter.Eq(c => c.UserId, userId);
            return await _commentThreads.Find(filter).ToListAsync();
        }

        public async Task<CommentThread?> GetCommentThreadByIdAsync(string id)
        {
            var filter = Builders<CommentThread>.Filter.Eq(c => c.CommentThreadId, id);
            return await _commentThreads.Find(filter).FirstOrDefaultAsync();
        }

        public async Task<CommentThread> CreateCommentThreadAsync(CommentThread commentThread)
        {
            commentThread.CreatedAt = DateTime.UtcNow;
            await _commentThreads.InsertOneAsync(commentThread);
            return commentThread;
        }

        public async Task<CommentThread> UpdateCommentThreadAsync(CommentThread commentThread)
        {
            var filter = Builders<CommentThread>.Filter.Eq(c => c.CommentThreadId, commentThread.CommentThreadId);
            var update = Builders<CommentThread>.Update
                .Set(c => c.Content, commentThread.Content)
                .Set(c => c.Rating, commentThread.Rating);
            
            await _commentThreads.UpdateOneAsync(filter, update);
            return commentThread;
        }

        public async Task<bool> DeleteCommentThreadAsync(string id)
        {
            var filter = Builders<CommentThread>.Filter.Eq(c => c.CommentThreadId, id);
            var result = await _commentThreads.DeleteOneAsync(filter);
            return result.DeletedCount > 0;
        }

        public async Task<bool> UpdateVoteCountsAsync(string id, int upvoteDelta, int downvoteDelta)
        {
            var filter = Builders<CommentThread>.Filter.Eq(c => c.CommentThreadId, id);
            var thread = await _commentThreads.Find(filter).FirstOrDefaultAsync();
            
            if (thread == null)
                return false;
            
            var update = Builders<CommentThread>.Update
                .Inc(c => c.UpvoteCount, upvoteDelta)
                .Inc(c => c.DownvoteCount, downvoteDelta);
            
            var result = await _commentThreads.UpdateOneAsync(filter, update);
            return result.ModifiedCount > 0;
        }

        public async Task<bool> IncrementRepliesCountAsync(string id)
        {
            var filter = Builders<CommentThread>.Filter.Eq(c => c.CommentThreadId, id);
            var update = Builders<CommentThread>.Update.Inc(c => c.RepliesCount, 1);
            var result = await _commentThreads.UpdateOneAsync(filter, update);
            return result.ModifiedCount > 0;
        }
    }
} 