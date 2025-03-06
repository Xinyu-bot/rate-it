using Microsoft.AspNetCore.Mvc;
using backend.DTOs;
using backend.Services;
using Microsoft.AspNetCore.Authorization;

namespace backend.Controllers
{
    [ApiController]
    [Route("api/categories")]
    public class CategoryController(ICategoryService categoryService) : ControllerBase
    {
        private readonly ICategoryService _categoryService = categoryService;

        [HttpGet]
        [ProducesResponseType(StatusCodes.Status200OK, Type = typeof(Response<CategoriesResponseDto>))]
        public async Task<IActionResult> GetAllCategories()
        {
            var categories = await _categoryService.GetAllCategoriesAsync();
            var response = new Response<CategoriesResponseDto>(0, "success", new CategoriesResponseDto
            {
                Categories = [.. categories]
            });
            return Ok(response);
        }

        [HttpGet("{id}")]
        [ProducesResponseType(StatusCodes.Status200OK, Type = typeof(Response<CategoryDto>))]
        [ProducesResponseType(StatusCodes.Status404NotFound)]
        public async Task<IActionResult> GetCategoryById(string id)
        {
            if (!Guid.TryParse(id, out var categoryId))
            {
                return BadRequest(new Response<object?>(1, "Invalid category ID format", null));
            }

            var category = await _categoryService.GetCategoryByIdAsync(categoryId);
            if (category == null)
            {
                return NotFound(new Response<object?>(1, "Category not found", null));
            }

            var response = new Response<CategoryDto>(0, "Success", category);
            return Ok(response);
        }

        [HttpPost]
        [Authorize]
        [ProducesResponseType(StatusCodes.Status201Created, Type = typeof(Response<CategoryDto>))]
        [ProducesResponseType(StatusCodes.Status400BadRequest)]
        public async Task<IActionResult> CreateCategory([FromBody] CategoryDto categoryDto)
        {
            if (string.IsNullOrEmpty(categoryDto.Name))
            {
                return BadRequest(new Response<object?>(1, "Category name is required", null));
            }

            var createdCategory = await _categoryService.CreateCategoryAsync(categoryDto.Name);
            var response = new Response<CategoryDto>(0, "Success", createdCategory);
            return CreatedAtAction(nameof(GetCategoryById), new { id = createdCategory.Id }, response);
        }

        [HttpPut("{id}")]
        [Authorize]
        [ProducesResponseType(StatusCodes.Status200OK, Type = typeof(Response<CategoryDto>))]
        [ProducesResponseType(StatusCodes.Status404NotFound)]
        [ProducesResponseType(StatusCodes.Status400BadRequest)]
        public async Task<IActionResult> UpdateCategory(string id, [FromBody] CategoryDto categoryDto)
        {
            if (!Guid.TryParse(id, out var categoryId))
            {
                return BadRequest(new Response<object?>(1, "Invalid category ID format", null));
            }

            if (string.IsNullOrEmpty(categoryDto.Name))
            {
                return BadRequest(new Response<object?>(1, "Category name is required", null));
            }

            try
            {
                var updatedCategory = await _categoryService.UpdateCategoryAsync(categoryId, categoryDto.Name);
                var response = new Response<CategoryDto>(0, "Success", updatedCategory);
                return Ok(response);
            }
            catch (KeyNotFoundException)
            {
                return NotFound(new Response<object?>(1, "Category not found", null));
            }
        }

        [HttpDelete("{id}")]
        [Authorize]
        [ProducesResponseType(StatusCodes.Status200OK, Type = typeof(Response<bool>))]
        [ProducesResponseType(StatusCodes.Status404NotFound)]
        public async Task<IActionResult> DeleteCategory(string id)
        {
            if (!Guid.TryParse(id, out var categoryId))
            {
                return BadRequest(new Response<object?>(1, "Invalid category ID format", null));
            }

            var result = await _categoryService.DeleteCategoryAsync(categoryId);
            if (!result)
            {
                return NotFound(new Response<object?>(1, "Category not found", null));
            }

            var response = new Response<bool>(0, "Success", true);
            return Ok(response);
        }
    }
} 