using Microsoft.AspNetCore.Mvc;
using backend.DTOs;
using backend.Services;
using Microsoft.AspNetCore.Authorization;

namespace backend.Controllers
{
    [ApiController]
    [Route("api")]
    public class VoteController(IVoteService voteService, IUserService userService) : ControllerBase
    {
        [HttpGet("user/me/votes")]
        [Authorize]
        public async Task<IActionResult> GetVotesByCurrentUser()
        {
            var userDetail = await userService.GetOrCreateUserAsync(User);
            var votes = await voteService.GetVotesByUserIdAsync(userDetail.UserId);
            var response = new Response<VotesResponseDto>(0, "Success", new VotesResponseDto
            {
                Votes = [.. votes]
            });
            return Ok(response);
        }

        [HttpGet("user/{userId}/votes")]
        public async Task<IActionResult> GetVotesByUserId(string userId)
        {
            if (!Guid.TryParse(userId, out var parsedUserId))
            {
                return BadRequest(new Response<object?>(1, "Invalid user ID format", null));
            }

            var votes = await voteService.GetVotesByUserIdAsync(parsedUserId);
            var response = new Response<VotesResponseDto>(0, "Success", new VotesResponseDto
            {
                Votes = [.. votes]
            });
            return Ok(response);
        }

        [HttpGet("comment_thread/{threadId}/vote")]
        [Authorize]
        public async Task<IActionResult> GetVoteByThreadId(string threadId)
        {
            var userDetail = await userService.GetOrCreateUserAsync(User);
            var vote = await voteService.GetVoteByUserAndThreadIdAsync(userDetail.UserId, threadId);
            if (vote == null)
            {
                return NotFound(new Response<object?>(1, "Vote not found", null));
            }

            var response = new Response<VoteDto>(0, "Success", vote);
            return Ok(response);
        }

        [HttpPost("vote")]
        [Authorize]
        public async Task<IActionResult> CreateOrUpdateVote([FromBody] CreateVoteRequestDto createVoteDto)
        {
            if (string.IsNullOrEmpty(createVoteDto.EntityId) || !Guid.TryParse(createVoteDto.EntityId, out _))
            {
                return BadRequest(new Response<object?>(1, "Valid entity ID is required", null));
            }

            if (string.IsNullOrEmpty(createVoteDto.CommentThreadId))
            {
                return BadRequest(new Response<object?>(1, "Comment thread ID is required", null));
            }

            if (string.IsNullOrEmpty(createVoteDto.VoteType) || 
                (createVoteDto.VoteType != "upvote" && createVoteDto.VoteType != "downvote"))
            {
                return BadRequest(new Response<object?>(1, "Vote type must be 'upvote' or 'downvote'", null));
            }

            try
            {
                var userDetail = await userService.GetOrCreateUserAsync(User);
                var vote = await voteService.CreateOrUpdateVoteAsync(createVoteDto, userDetail.UserId);
                var response = new Response<VoteDto>(0, "Success", vote);
                return Ok(response);
            }
            catch (Exception ex)
            {
                return BadRequest(new Response<object?>(1, ex.Message, null));
            }
        }

        [HttpDelete("comment_thread/{threadId}/vote")]
        [Authorize]
        public async Task<IActionResult> DeleteVote(string threadId)
        {
            try
            {
                var userDetail = await userService.GetOrCreateUserAsync(User);
                var result = await voteService.DeleteVoteAsync(threadId, userDetail.UserId);
                if (!result)
                {
                    return NotFound(new Response<object?>(1, "Vote not found", null));
                }

                var response = new Response<bool>(0, "Success", true);
                return Ok(response);
            }
            catch (Exception ex)
            {
                return BadRequest(new Response<object?>(1, ex.Message, null));
            }
        }
    }
} 