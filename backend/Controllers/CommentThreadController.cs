using Microsoft.AspNetCore.Mvc;
using backend.DTOs;
using backend.Services;
using Microsoft.AspNetCore.Authorization;

namespace backend.Controllers
{
    [ApiController]
    [Route("api/comment_threads")]
    public class CommentThreadController(ICommentThreadService commentThreadService, IUserService userService) : ControllerBase
    {
        [HttpGet]
        public async Task<IActionResult> GetAllCommentThreads()
        {
            Guid? currentUserId = null;
            if (User.Identity?.IsAuthenticated == true)
            {
                var userDetail = await userService.GetOrCreateUserAsync(User);
                currentUserId = userDetail.UserId;
            }

            var threads = await commentThreadService.GetAllCommentThreadsAsync(currentUserId);
            var response = new Response<CommentThreadsResponseDto>(0, "Success", new CommentThreadsResponseDto
            {
                CommentThreads = [.. threads]
            });
            return Ok(response);
        }

        [HttpGet("entity/{entityId}")]
        public async Task<IActionResult> GetCommentThreadsByEntityId(string entityId)
        {
            if (!Guid.TryParse(entityId, out var parsedEntityId))
            {
                return BadRequest(new Response<object?>(1, "Invalid entity ID format", null));
            }

            Guid? currentUserId = null;
            if (User.Identity?.IsAuthenticated == true)
            {
                var userDetail = await userService.GetOrCreateUserAsync(User);
                currentUserId = userDetail.UserId;
            }

            var threads = await commentThreadService.GetCommentThreadsByEntityIdAsync(parsedEntityId, currentUserId);
            var response = new Response<CommentThreadsResponseDto>(0, "Success", new CommentThreadsResponseDto
            {
                CommentThreads = [.. threads]
            });
            return Ok(response);
        }

        [HttpGet("{id}")]
        public async Task<IActionResult> GetCommentThreadById(string id)
        {
            Guid? currentUserId = null;
            if (User.Identity?.IsAuthenticated == true)
            {
                var userDetail = await userService.GetOrCreateUserAsync(User);
                currentUserId = userDetail.UserId;
            }

            var thread = await commentThreadService.GetCommentThreadByIdAsync(id, currentUserId);
            if (thread == null)
            {
                return NotFound(new Response<object?>(1, "Comment thread not found", null));
            }

            var response = new Response<CommentThreadDto>(0, "Success", thread);
            return Ok(response);
        }

        [HttpPost]
        [Authorize]
        public async Task<IActionResult> CreateCommentThread([FromBody] CreateCommentThreadRequestDto createThreadDto)
        {
            if (string.IsNullOrEmpty(createThreadDto.EntityId) || !Guid.TryParse(createThreadDto.EntityId, out _))
            {
                return BadRequest(new Response<object?>(1, "Valid entity ID is required", null));
            }

            if (string.IsNullOrEmpty(createThreadDto.Content))
            {
                return BadRequest(new Response<object?>(1, "Content is required", null));
            }

            if (createThreadDto.Rating < 1 || createThreadDto.Rating > 5)
            {
                return BadRequest(new Response<object?>(1, "Rating must be between 1 and 5", null));
            }

            try
            {
                var userDetail = await userService.GetOrCreateUserAsync(User);
                var createdThread = await commentThreadService.CreateCommentThreadAsync(createThreadDto, userDetail.UserId);
                var response = new Response<CommentThreadDto>(0, "Success", createdThread);
                return CreatedAtAction(nameof(GetCommentThreadById), new { id = createdThread.CommentThreadId }, response);
            }
            catch (Exception ex)
            {
                return BadRequest(new Response<object?>(1, ex.Message, null));
            }
        }

        [HttpPut("{id}")]
        [Authorize]
        public async Task<IActionResult> UpdateCommentThread(string id, [FromBody] UpdateCommentThreadRequestDto updateThreadDto)
        {
            try
            {
                var userDetail = await userService.GetOrCreateUserAsync(User);
                var updatedThread = await commentThreadService.UpdateCommentThreadAsync(id, updateThreadDto, userDetail.UserId);
                var response = new Response<CommentThreadDto>(0, "Success", updatedThread);
                return Ok(response);
            }
            catch (KeyNotFoundException)
            {
                return NotFound(new Response<object?>(1, "Comment thread not found", null));
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

        [HttpDelete("{id}")]
        [Authorize]
        public async Task<IActionResult> DeleteCommentThread(string id)
        {
            try
            {
                var userDetail = await userService.GetOrCreateUserAsync(User);
                var result = await commentThreadService.DeleteCommentThreadAsync(id, userDetail.UserId);
                if (!result)
                {
                    return NotFound(new Response<object?>(1, "Comment thread not found", null));
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