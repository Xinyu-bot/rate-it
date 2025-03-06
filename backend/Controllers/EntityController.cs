using Microsoft.AspNetCore.Mvc;
using backend.DTOs;
using backend.Services;
using Microsoft.AspNetCore.Authorization;

namespace backend.Controllers
{
    [ApiController]
    [Route("api")]
    public class EntityController(IEntityService entityService, IUserService userService) : ControllerBase
    {
        [HttpGet("entities")]
        public async Task<IActionResult> GetAllEntities()
        {
            var entities = await entityService.GetAllEntitiesAsync();
            var response = new Response<EntitiesResponseDto>(0, "Success", new EntitiesResponseDto
            {
                Entities = [.. entities]
            });
            return Ok(response);
        }

        [HttpGet("entity/{id}")]
        public async Task<IActionResult> GetEntityById(string id)
        {
            if (!Guid.TryParse(id, out var entityId))
            {
                return BadRequest(new Response<object?>(1, "Invalid entity ID format", null));
            }

            var entity = await entityService.GetEntityByIdAsync(entityId);
            if (entity == null)
            {
                return NotFound(new Response<object?>(1, "Entity not found", null));
            }

            var response = new Response<EntityDto>(0, "Success", entity);
            return Ok(response);
        }

        [HttpGet("category/{categoryId}/entities")]
        public async Task<IActionResult> GetEntitiesByCategoryId(string categoryId)
        {
            if (!Guid.TryParse(categoryId, out var parsedCategoryId))
            {
                return BadRequest(new Response<object?>(1, "Invalid category ID format", null));
            }

            var entities = await entityService.GetEntitiesByCategoryIdAsync(parsedCategoryId);
            var response = new Response<EntitiesResponseDto>(0, "Success", new EntitiesResponseDto
            {
                Entities = [.. entities]
            });
            return Ok(response);
        }

        [HttpPost("entity")]
        [Authorize]
        public async Task<IActionResult> CreateEntity([FromBody] CreateEntityRequestDto createEntityDto)
        {
            if (string.IsNullOrEmpty(createEntityDto.Name))
            {
                return BadRequest(new Response<object?>(1, "Entity name is required", null));
            }

            if (string.IsNullOrEmpty(createEntityDto.CategoryId) || !Guid.TryParse(createEntityDto.CategoryId, out _))
            {
                return BadRequest(new Response<object?>(1, "Valid category ID is required", null));
            }

            try
            {
                var userDetail = await userService.GetOrCreateUserAsync(User);
                var createdEntity = await entityService.CreateEntityAsync(createEntityDto, userDetail.UserId);
                var response = new Response<EntityDto>(0, "Success", createdEntity);
                return CreatedAtAction(nameof(GetEntityById), new { id = createdEntity.Id }, response);
            }
            catch (Exception ex)
            {
                return BadRequest(new Response<object?>(1, ex.Message, null));
            }
        }

        [HttpPut("entity/{id}")]
        [Authorize]
        public async Task<IActionResult> UpdateEntity(string id, [FromBody] UpdateEntityRequestDto updateEntityDto)
        {
            if (!Guid.TryParse(id, out var entityId))
            {
                return BadRequest(new Response<object?>(1, "Invalid entity ID format", null));
            }

            try
            {
                var updatedEntity = await entityService.UpdateEntityAsync(entityId, updateEntityDto);
                var response = new Response<EntityDto>(0, "Success", updatedEntity);
                return Ok(response);
            }
            catch (KeyNotFoundException)
            {
                return NotFound(new Response<object?>(1, "Entity not found", null));
            }
            catch (Exception ex)
            {
                return BadRequest(new Response<object?>(1, ex.Message, null));
            }
        }

        [HttpDelete("entity/{id}")]
        [Authorize]
        public async Task<IActionResult> DeleteEntity(string id)
        {
            if (!Guid.TryParse(id, out var entityId))
            {
                return BadRequest(new Response<object?>(1, "Invalid entity ID format", null));
            }

            var result = await entityService.DeleteEntityAsync(entityId);
            if (!result)
            {
                return NotFound(new Response<object?>(1, "Entity not found", null));
            }

            var response = new Response<bool>(0, "Success", true);
            return Ok(response);
        }
    }
} 