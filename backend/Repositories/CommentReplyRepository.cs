using backend.Models;
using backend.Data;
using MongoDB.Driver;
using System;
using System.Collections.Generic;
using System.Threading.Tasks;

namespace backend.Repositories
{
    public class CommentReplyRepository : ICommentReplyRepository
    {
        private readonly IMongoCollection<CommentReply> _commentReplies;
        private readonly ICommentThreadRepository _commentThreadRepository;

        public CommentReplyRepository(MongoDBContext context, ICommentThreadRepository commentThreadRepository)
        {
            _commentReplies = context.CommentReplies;
            _commentThreadRepository = commentThreadRepository;
        }

        public async Task<IEnumerable<CommentReply>> GetRepliesByThreadIdAsync(string threadId)
        {
            var filter = Builders<CommentReply>.Filter.Eq(r => r.CommentThreadId, threadId);
            return await _commentReplies.Find(filter).ToListAsync();
        }

        public async Task<IEnumerable<CommentReply>> GetRepliesByUserIdAsync(Guid userId)
        {
            var filter = Builders<CommentReply>.Filter.Eq(r => r.UserId, userId);
            return await _commentReplies.Find(filter).ToListAsync();
        }

        public async Task<CommentReply?> GetReplyByIdAsync(string id)
        {
            var filter = Builders<CommentReply>.Filter.Eq(r => r.CommentReplyId, id);
            return await _commentReplies.Find(filter).FirstOrDefaultAsync();
        }

        public async Task<CommentReply> CreateReplyAsync(CommentReply reply)
        {
            reply.CreatedAt = DateTime.UtcNow;
            await _commentReplies.InsertOneAsync(reply);
            
            // Increment the replies count in the parent thread
            await _commentThreadRepository.IncrementRepliesCountAsync(reply.CommentThreadId);
            
            return reply;
        }

        public async Task<CommentReply> UpdateReplyAsync(CommentReply reply)
        {
            var filter = Builders<CommentReply>.Filter.Eq(r => r.CommentReplyId, reply.CommentReplyId);
            var update = Builders<CommentReply>.Update
                .Set(r => r.Content, reply.Content);
            
            await _commentReplies.UpdateOneAsync(filter, update);
            return reply;
        }

        public async Task<bool> DeleteReplyAsync(string id)
        {
            var filter = Builders<CommentReply>.Filter.Eq(r => r.CommentReplyId, id);
            var result = await _commentReplies.DeleteOneAsync(filter);
            return result.DeletedCount > 0;
        }
    }
} 