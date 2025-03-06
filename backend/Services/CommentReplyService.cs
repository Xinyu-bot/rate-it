using backend.DTOs;
using backend.Models;
using backend.Repositories;

namespace backend.Services
{
    public class CommentReplyService(ICommentReplyRepository commentReplyRepository, ICommentThreadRepository commentThreadRepository) : ICommentReplyService
    {
        public async Task<IEnumerable<CommentReplyDto>> GetRepliesByThreadIdAsync(string threadId)
        {
            var replies = await commentReplyRepository.GetRepliesByThreadIdAsync(threadId);
            return replies.Select(MapCommentReplyToDto);
        }

        public async Task<IEnumerable<CommentReplyDto>> GetRepliesByUserIdAsync(Guid userId)
        {
            var replies = await commentReplyRepository.GetRepliesByUserIdAsync(userId);
            return replies.Select(MapCommentReplyToDto);
        }

        public async Task<CommentReplyDto?> GetReplyByIdAsync(string id)
        {
            var reply = await commentReplyRepository.GetReplyByIdAsync(id);
            return reply != null ? MapCommentReplyToDto(reply) : null;
        }

        public async Task<CommentReplyDto> CreateReplyAsync(CreateCommentReplyRequestDto createReplyDto, Guid userId)
        {
            var reply = new CommentReply
            {
                CommentThreadId = createReplyDto.CommentThreadId,
                ParentReplyId = createReplyDto.ParentReplyId,
                UserId = userId,
                Content = createReplyDto.Content,
                CreatedAt = DateTime.UtcNow
            };

            var createdReply = await commentReplyRepository.CreateReplyAsync(reply);
            
            // Increment the replies count on the thread
            await commentThreadRepository.IncrementRepliesCountAsync(createReplyDto.CommentThreadId);
            
            return MapCommentReplyToDto(createdReply);
        }

        public async Task<CommentReplyDto> UpdateReplyAsync(string id, UpdateCommentReplyRequestDto updateReplyDto, Guid userId)
        {
            var reply = await commentReplyRepository.GetReplyByIdAsync(id);
            if (reply == null)
            {
                throw new KeyNotFoundException($"Comment reply with ID {id} not found");
            }

            if (reply.UserId != userId)
            {
                throw new UnauthorizedAccessException("You are not authorized to update this comment reply");
            }

            reply.Content = updateReplyDto.Content;

            var updatedReply = await commentReplyRepository.UpdateReplyAsync(reply);
            return MapCommentReplyToDto(updatedReply);
        }

        public async Task<bool> DeleteReplyAsync(string id, Guid userId)
        {
            var reply = await commentReplyRepository.GetReplyByIdAsync(id);
            if (reply == null)
            {
                return false;
            }

            if (reply.UserId != userId)
            {
                throw new UnauthorizedAccessException("You are not authorized to delete this comment reply");
            }

            return await commentReplyRepository.DeleteReplyAsync(id);
        }

        private static CommentReplyDto MapCommentReplyToDto(CommentReply reply)
        {
            return new CommentReplyDto
            {
                CommentReplyId = reply.CommentReplyId,
                CommentThreadId = reply.CommentThreadId,
                ParentReplyId = reply.ParentReplyId,
                UserId = reply.UserId.ToString(),
                Content = reply.Content,
                CreatedAt = reply.CreatedAt
            };
        }
    }
} 