using backend.DTOs;
using backend.Models;
using backend.Repositories;

namespace backend.Services
{
    public class VoteService(IVoteRepository voteRepository, ICommentThreadRepository commentThreadRepository) : IVoteService
    {
        public async Task<IEnumerable<VoteDto>> GetVotesByUserIdAsync(Guid userId)
        {
            var votes = await voteRepository.GetVotesByUserIdAsync(userId);
            return votes.Select(MapVoteToDto);
        }

        public async Task<VoteDto?> GetVoteByUserAndThreadIdAsync(Guid userId, string threadId)
        {
            var vote = await voteRepository.GetVoteByUserAndThreadIdAsync(userId, threadId);
            return vote != null ? MapVoteToDto(vote) : null;
        }

        public async Task<VoteDto> CreateOrUpdateVoteAsync(CreateVoteRequestDto createVoteDto, Guid userId)
        {
            var existingVote = await voteRepository.GetVoteByUserAndThreadIdAsync(userId, createVoteDto.CommentThreadId);
            
            if (existingVote != null)
            {
                // If the vote type is the same, do nothing
                if (existingVote.VoteType == createVoteDto.VoteType)
                {
                    return MapVoteToDto(existingVote);
                }
                
                // Update vote counts on the thread
                int upvoteDelta = 0;
                int downvoteDelta = 0;
                
                if (existingVote.VoteType == "upvote" && createVoteDto.VoteType == "downvote")
                {
                    upvoteDelta = -1;
                    downvoteDelta = 1;
                }
                else if (existingVote.VoteType == "downvote" && createVoteDto.VoteType == "upvote")
                {
                    upvoteDelta = 1;
                    downvoteDelta = -1;
                }
                
                await commentThreadRepository.UpdateVoteCountsAsync(createVoteDto.CommentThreadId, upvoteDelta, downvoteDelta);
                
                // Update the vote
                existingVote.VoteType = createVoteDto.VoteType;
                var updatedVote = await voteRepository.UpdateVoteAsync(existingVote);
                return MapVoteToDto(updatedVote);
            }
            else
            {
                // Create a new vote
                var vote = new Vote
                {
                    EntityId = Guid.Parse(createVoteDto.EntityId),
                    CommentThreadId = createVoteDto.CommentThreadId,
                    UserId = userId,
                    VoteType = createVoteDto.VoteType,
                    CreatedAt = DateTime.UtcNow
                };
                
                // Update vote counts on the thread
                int upvoteDelta = createVoteDto.VoteType == "upvote" ? 1 : 0;
                int downvoteDelta = createVoteDto.VoteType == "downvote" ? 1 : 0;
                
                await commentThreadRepository.UpdateVoteCountsAsync(createVoteDto.CommentThreadId, upvoteDelta, downvoteDelta);
                
                var createdVote = await voteRepository.CreateVoteAsync(vote);
                return MapVoteToDto(createdVote);
            }
        }

        public async Task<bool> DeleteVoteAsync(string threadId, Guid userId)
        {
            var vote = await voteRepository.GetVoteByUserAndThreadIdAsync(userId, threadId);
            if (vote == null)
            {
                return false;
            }
            
            // Update vote counts on the thread
            int upvoteDelta = vote.VoteType == "upvote" ? -1 : 0;
            int downvoteDelta = vote.VoteType == "downvote" ? -1 : 0;
            
            await commentThreadRepository.UpdateVoteCountsAsync(threadId, upvoteDelta, downvoteDelta);
            
            return await voteRepository.DeleteVoteAsync(vote.Id);
        }

        private static VoteDto MapVoteToDto(Vote vote)
        {
            return new VoteDto
            {
                EntityId = vote.EntityId.ToString(),
                CommentThreadId = vote.CommentThreadId,
                VoteType = vote.VoteType,
                CreatedAt = vote.CreatedAt
            };
        }
    }
} 