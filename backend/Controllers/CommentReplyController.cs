using Microsoft.AspNetCore.Mvc;
using backend.DTOs;
using backend.Services;
using Microsoft.AspNetCore.Authorization;

namespace backend.Controllers
{
    [ApiController]
    [Route("api")]
    public class CommentReplyController(ICommentReplyService commentReplyService, IUserService userService) : ControllerBase
    {
        private readonly ICommentReplyService _commentReplyService = commentReplyService;
        private readonly IUserService _userService = userService;

        [HttpGet("comment_threads/{threadId}/replies")]
        public async Task<IActionResult> GetRepliesByThreadId(string threadId)
        {
            var replies = await _commentReplyService.GetRepliesByThreadIdAsync(threadId);
            var response = new Response<CommentRepliesResponseDto>(0, "Success", new CommentRepliesResponseDto
            {
                CommentReplies = [.. replies]
            });
            return Ok(response);
        }

        [HttpGet("user/me/replies")]
        [Authorize]
        public async Task<IActionResult> GetRepliesByCurrentUser()
        {
            var userDetail = await _userService.GetOrCreateUserAsync(User);
            var replies = await _commentReplyService.GetRepliesByUserIdAsync(userDetail.UserId);
            var response = new Response<CommentRepliesResponseDto>(0, "Success", new CommentRepliesResponseDto
            {
                CommentReplies = [.. replies]
            });
            return Ok(response);
        }

        [HttpGet("user/{userId}/replies")]
        public async Task<IActionResult> GetRepliesByUserId(string userId)
        {
            if (!Guid.TryParse(userId, out var parsedUserId))
            {
                return BadRequest(new Response<object?>(1, "Invalid user ID format", null));
            }

            var replies = await _commentReplyService.GetRepliesByUserIdAsync(parsedUserId);
            var response = new Response<CommentRepliesResponseDto>(0, "Success", new CommentRepliesResponseDto
            {
                CommentReplies = [.. replies]
            });
            return Ok(response);
        }

        [HttpGet("comment_reply/{id}")]
        public async Task<IActionResult> GetReplyById(string id)
        {
            var reply = await _commentReplyService.GetReplyByIdAsync(id);
            if (reply == null)
            {
                return NotFound(new Response<object?>(1, "Comment reply not found", null));
            }

            var response = new Response<CommentReplyDto>(0, "Success", reply);
            return Ok(response);
        }

        [HttpPost("comment_reply")]
        [Authorize]
        public async Task<IActionResult> CreateReply([FromBody] CreateCommentReplyRequestDto createReplyDto)
        {
            if (string.IsNullOrEmpty(createReplyDto.CommentThreadId))
            {
                return BadRequest(new Response<object?>(1, "Comment thread ID is required", null));
            }

            if (string.IsNullOrEmpty(createReplyDto.Content))
            {
                return BadRequest(new Response<object?>(1, "Content is required", null));
            }

            try
            {
                var userDetail = await _userService.GetOrCreateUserAsync(User);
                var createdReply = await _commentReplyService.CreateReplyAsync(createReplyDto, userDetail.UserId);
                var response = new Response<CommentReplyDto>(0, "Success", createdReply);
                return CreatedAtAction(nameof(GetReplyById), new { id = createdReply.CommentReplyId }, response);
            }
            catch (Exception ex)
            {
                return BadRequest(new Response<object?>(1, ex.Message, null));
            }
        }

        [HttpPut("comment_reply/{id}")]
        [Authorize]
        public async Task<IActionResult> UpdateReply(string id, [FromBody] UpdateCommentReplyRequestDto updateReplyDto)
        {
            try
            {
                var userDetail = await _userService.GetOrCreateUserAsync(User);
                var updatedReply = await _commentReplyService.UpdateReplyAsync(id, updateReplyDto, userDetail.UserId);
                var response = new Response<CommentReplyDto>(0, "Success", updatedReply);
                return Ok(response);
            }
            catch (KeyNotFoundException)
            {
                return NotFound(new Response<object?>(1, "Comment reply not found", null));
            }
            catch (UnauthorizedAccessException ex)
            {
                return Forbid(ex.Message);
            }
            catch (Exception ex)
            {
                return BadRequest(new Response<object?>(1, ex.Message, null));
            }
        }

        [HttpDelete("comment_reply/{id}")]
        [Authorize]
        public async Task<IActionResult> DeleteReply(string id)
        {
            try
            {
                var userDetail = await _userService.GetOrCreateUserAsync(User);
                var result = await _commentReplyService.DeleteReplyAsync(id, userDetail.UserId);
                if (!result)
                {
                    return NotFound(new Response<object?>(1, "Comment reply not found", null));
                }

                var response = new Response<bool>(0, "Success", true);
                return Ok(response);
            }
            catch (UnauthorizedAccessException ex)
            {
                return Forbid(ex.Message);
            }
            catch (Exception ex)
            {
                return BadRequest(new Response<object?>(1, ex.Message, null));
            }
        }
    }
} 