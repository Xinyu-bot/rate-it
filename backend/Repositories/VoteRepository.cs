using backend.Models;
using backend.Data;
using MongoDB.Driver;
using MongoDB.Bson;
using System;
using System.Collections.Generic;
using System.Threading.Tasks;
using System.Linq;

namespace backend.Repositories
{
    public class VoteRepository : IVoteRepository
    {
        private readonly IMongoCollection<UserVotes> _userVotes;

        public VoteRepository(MongoDBContext context)
        {
            _userVotes = context.Database.GetCollection<UserVotes>("user_votes");
        }

        public async Task<IEnumerable<Vote>> GetVotesByUserIdAsync(Guid userId)
        {
            var filter = Builders<UserVotes>.Filter.Eq(uv => uv.UserId, userId);
            var userVotes = await _userVotes.Find(filter).FirstOrDefaultAsync();
            
            if (userVotes == null)
            {
                return new List<Vote>();
            }
            
            return userVotes.Votes;
        }

        public async Task<Vote?> GetVoteByUserAndThreadIdAsync(Guid userId, string threadId)
        {
            var filter = Builders<UserVotes>.Filter.Eq(uv => uv.UserId, userId);
            var userVotes = await _userVotes.Find(filter).FirstOrDefaultAsync();
            
            if (userVotes == null)
            {
                return null;
            }
            
            return userVotes.Votes.FirstOrDefault(v => v.CommentThreadId == threadId);
        }

        public async Task<Vote> CreateVoteAsync(Vote vote)
        {
            // Check if the user already has a votes document
            var filter = Builders<UserVotes>.Filter.Eq(uv => uv.UserId, vote.UserId);
            var userVotes = await _userVotes.Find(filter).FirstOrDefaultAsync();
            
            // Set creation time
            vote.CreatedAt = DateTime.UtcNow;
            
            if (userVotes == null)
            {
                // Create a new user votes document
                userVotes = new UserVotes
                {
                    UserId = vote.UserId,
                    Votes = new List<Vote> { vote }
                };
                
                await _userVotes.InsertOneAsync(userVotes);
            }
            else
            {
                // Check if a vote for this thread already exists
                var existingVoteIndex = userVotes.Votes.FindIndex(v => v.CommentThreadId == vote.CommentThreadId);
                
                if (existingVoteIndex >= 0)
                {
                    // Update the existing vote
                    userVotes.Votes[existingVoteIndex] = vote;
                    
                    var update = Builders<UserVotes>.Update.Set(uv => uv.Votes, userVotes.Votes);
                    await _userVotes.UpdateOneAsync(filter, update);
                }
                else
                {
                    // Add the new vote
                    var update = Builders<UserVotes>.Update.Push(uv => uv.Votes, vote);
                    await _userVotes.UpdateOneAsync(filter, update);
                }
            }
            
            return vote;
        }

        public async Task<Vote> UpdateVoteAsync(Vote vote)
        {
            var filter = Builders<UserVotes>.Filter.Eq(uv => uv.UserId, vote.UserId);
            var userVotes = await _userVotes.Find(filter).FirstOrDefaultAsync();
            
            if (userVotes == null)
            {
                throw new KeyNotFoundException($"User with ID {vote.UserId} not found");
            }
            
            var existingVoteIndex = userVotes.Votes.FindIndex(v => v.Id == vote.Id);
            
            if (existingVoteIndex < 0)
            {
                throw new KeyNotFoundException($"Vote with ID {vote.Id} not found");
            }
            
            userVotes.Votes[existingVoteIndex] = vote;
            
            var update = Builders<UserVotes>.Update.Set(uv => uv.Votes, userVotes.Votes);
            await _userVotes.UpdateOneAsync(filter, update);
            
            return vote;
        }

        public async Task<bool> DeleteVoteAsync(string id)
        {
            // Find the user votes document containing the vote
            var filter = Builders<UserVotes>.Filter.ElemMatch(uv => uv.Votes, v => v.Id == id);
            var userVotes = await _userVotes.Find(filter).FirstOrDefaultAsync();
            
            if (userVotes == null)
            {
                return false;
            }
            
            // Remove the vote from the list
            var voteIndex = userVotes.Votes.FindIndex(v => v.Id == id);
            if (voteIndex < 0)
            {
                return false;
            }
            
            userVotes.Votes.RemoveAt(voteIndex);
            
            // Update the document
            var updateFilter = Builders<UserVotes>.Filter.Eq(uv => uv.UserId, userVotes.UserId);
            var update = Builders<UserVotes>.Update.Set(uv => uv.Votes, userVotes.Votes);
            var result = await _userVotes.UpdateOneAsync(updateFilter, update);
            
            return result.ModifiedCount > 0;
        }
    }
} 