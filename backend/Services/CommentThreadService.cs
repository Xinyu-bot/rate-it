using backend.DTOs;
using backend.Models;
using backend.Repositories;

namespace backend.Services
{
    public class CommentThreadService(ICommentThreadRepository commentThreadRepository, IVoteRepository voteRepository) : ICommentThreadService
    {
        public async Task<IEnumerable<CommentThreadDto>> GetAllCommentThreadsAsync(Guid? currentUserId = null)
        {
            var threads = await commentThreadRepository.GetAllCommentThreadsAsync();
            return await EnrichThreadsWithVoteStatus(threads, currentUserId);
        }

        public async Task<IEnumerable<CommentThreadDto>> GetCommentThreadsByEntityIdAsync(Guid entityId, Guid? currentUserId = null)
        {
            var threads = await commentThreadRepository.GetCommentThreadsByEntityIdAsync(entityId);
            return await EnrichThreadsWithVoteStatus(threads, currentUserId);
        }

        public async Task<IEnumerable<CommentThreadDto>> GetCommentThreadsByUserIdAsync(Guid userId)
        {
            var threads = await commentThreadRepository.GetCommentThreadsByUserIdAsync(userId);
            return threads.Select(MapCommentThreadToDto);
        }

        public async Task<CommentThreadDto?> GetCommentThreadByIdAsync(string id, Guid? currentUserId = null)
        {
            var thread = await commentThreadRepository.GetCommentThreadByIdAsync(id);
            if (thread == null)
            {
                return null;
            }

            var dto = MapCommentThreadToDto(thread);
            
            if (currentUserId.HasValue)
            {
                var vote = await voteRepository.GetVoteByUserAndThreadIdAsync(currentUserId.Value, id);
                if (vote != null)
                {
                    dto.MyVoteStatus = vote.VoteType == "upvote" ? 1 : 2;
                }
            }
            
            return dto;
        }

        public async Task<CommentThreadDto> CreateCommentThreadAsync(CreateCommentThreadRequestDto createThreadDto, Guid userId)
        {
            var thread = new CommentThread
            {
                EntityId = Guid.Parse(createThreadDto.EntityId),
                UserId = userId,
                Rating = createThreadDto.Rating,
                Content = createThreadDto.Content,
                CreatedAt = DateTime.UtcNow,
                UpvoteCount = 0,
                DownvoteCount = 0,
                RepliesCount = 0
            };

            var createdThread = await commentThreadRepository.CreateCommentThreadAsync(thread);
            return MapCommentThreadToDto(createdThread);
        }

        public async Task<CommentThreadDto> UpdateCommentThreadAsync(string id, UpdateCommentThreadRequestDto updateThreadDto, Guid userId)
        {
            var thread = await commentThreadRepository.GetCommentThreadByIdAsync(id);
            if (thread == null)
            {
                throw new KeyNotFoundException($"Comment thread with ID {id} not found");
            }

            if (thread.UserId != userId)
            {
                throw new UnauthorizedAccessException("You are not authorized to update this comment thread");
            }

            if (updateThreadDto.Rating.HasValue)
            {
                thread.Rating = updateThreadDto.Rating.Value;
            }

            if (!string.IsNullOrEmpty(updateThreadDto.Content))
            {
                thread.Content = updateThreadDto.Content;
            }

            var updatedThread = await commentThreadRepository.UpdateCommentThreadAsync(thread);
            return MapCommentThreadToDto(updatedThread);
        }

        public async Task<bool> DeleteCommentThreadAsync(string id, Guid userId)
        {
            var thread = await commentThreadRepository.GetCommentThreadByIdAsync(id);
            if (thread == null)
            {
                return false;
            }

            if (thread.UserId != userId)
            {
                throw new UnauthorizedAccessException("You are not authorized to delete this comment thread");
            }

            return await commentThreadRepository.DeleteCommentThreadAsync(id);
        }

        private static CommentThreadDto MapCommentThreadToDto(CommentThread thread)
        {
            return new CommentThreadDto
            {
                CommentThreadId = thread.CommentThreadId,
                EntityId = thread.EntityId.ToString(),
                UserId = thread.UserId.ToString(),
                Rating = thread.Rating,
                Content = thread.Content,
                CreatedAt = thread.CreatedAt,
                UpvoteCount = thread.UpvoteCount,
                DownvoteCount = thread.DownvoteCount,
                RepliesCount = thread.RepliesCount,
                MyVoteStatus = 0 // Default to no vote, will be updated if needed
            };
        }

        private async Task<IEnumerable<CommentThreadDto>> EnrichThreadsWithVoteStatus(IEnumerable<CommentThread> threads, Guid? currentUserId)
        {
            var threadDtos = threads.Select(MapCommentThreadToDto).ToList();
            
            if (currentUserId.HasValue)
            {
                var userVotes = await voteRepository.GetVotesByUserIdAsync(currentUserId.Value);
                var votesByThreadId = userVotes.ToDictionary(v => v.CommentThreadId, v => v.VoteType);
                
                foreach (var dto in threadDtos)
                {
                    if (votesByThreadId.TryGetValue(dto.CommentThreadId, out var voteType))
                    {
                        dto.MyVoteStatus = voteType == "upvote" ? 1 : 2;
                    }
                }
            }
            
            return threadDtos;
        }
    }
} 