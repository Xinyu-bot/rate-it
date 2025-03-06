using backend.Models;
using MongoDB.Bson;

namespace backend.Repositories
{
    public class MockVoteRepository : IVoteRepository
    {
        private readonly List<Vote> _votes =
        [
            new Vote
            {
                Id = ObjectId.GenerateNewId().ToString(),
                EntityId = Guid.Parse("11111111-1111-1111-1111-111111111111"),
                CommentThreadId = "01HQ5JTGZJ8GFXZ1PPKR3KYMEH",
                UserId = Guid.Parse("33333333-3333-3333-3333-333333333333"),
                VoteType = "upvote",
                CreatedAt = DateTime.UtcNow.AddDays(-5)
            },
            new Vote
            {
                Id = ObjectId.GenerateNewId().ToString(),
                EntityId = Guid.Parse("11111111-1111-1111-1111-111111111111"),
                CommentThreadId = "01HQ5JTGZJ8GFXZ1PPKR3KYMEI",
                UserId = Guid.Parse("44444444-4444-4444-4444-444444444444"),
                VoteType = "downvote",
                CreatedAt = DateTime.UtcNow.AddDays(-4)
            }
        ];

        public Task<IEnumerable<Vote>> GetVotesByUserIdAsync(Guid userId)
        {
            var votes = _votes.Where(v => v.UserId == userId).ToList();
            return Task.FromResult<IEnumerable<Vote>>(votes);
        }

        public Task<Vote?> GetVoteByUserAndThreadIdAsync(Guid userId, string threadId)
        {
            var vote = _votes.FirstOrDefault(v => v.UserId == userId && v.CommentThreadId == threadId);
            return Task.FromResult(vote);
        }

        public Task<Vote> CreateVoteAsync(Vote vote)
        {
            if (string.IsNullOrEmpty(vote.Id))
            {
                vote.Id = ObjectId.GenerateNewId().ToString();
            }
            
            vote.CreatedAt = DateTime.UtcNow;
            
            _votes.Add(vote);
            return Task.FromResult(vote);
        }

        public Task<Vote> UpdateVoteAsync(Vote vote)
        {
            var existingVote = _votes.FirstOrDefault(v => v.Id == vote.Id);
            if (existingVote == null)
            {
                throw new KeyNotFoundException($"Vote with ID {vote.Id} not found");
            }

            existingVote.VoteType = vote.VoteType;
            
            return Task.FromResult(existingVote);
        }

        public Task<bool> DeleteVoteAsync(string id)
        {
            var vote = _votes.FirstOrDefault(v => v.Id == id);
            if (vote == null)
            {
                return Task.FromResult(false);
            }

            _votes.Remove(vote);
            return Task.FromResult(true);
        }
    }
} 