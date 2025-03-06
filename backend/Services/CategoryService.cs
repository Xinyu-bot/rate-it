using backend.DTOs;
using backend.Models;
using backend.Repositories;

namespace backend.Services
{
    public class CategoryService(ICategoryRepository categoryRepository) : ICategoryService
    {
        public async Task<IEnumerable<CategoryDto>> GetAllCategoriesAsync()
        {
            var categories = await categoryRepository.GetAllCategoriesAsync();
            return categories.Select(MapCategoryToDto);
        }

        public async Task<CategoryDto?> GetCategoryByIdAsync(Guid id)
        {
            var category = await categoryRepository.GetCategoryByIdAsync(id);
            return category != null ? MapCategoryToDto(category) : null;
        }

        public async Task<CategoryDto> CreateCategoryAsync(string name)
        {
            var category = new Category
            {
                Name = name,
                CreatedAt = DateTime.UtcNow,
                UpdatedAt = DateTime.UtcNow
            };

            var createdCategory = await categoryRepository.CreateCategoryAsync(category);
            return MapCategoryToDto(createdCategory);
        }

        public async Task<CategoryDto> UpdateCategoryAsync(Guid id, string name)
        {
            var category = await categoryRepository.GetCategoryByIdAsync(id);
            if (category == null)
            {
                throw new KeyNotFoundException($"Category with ID {id} not found");
            }

            category.Name = name;
            category.UpdatedAt = DateTime.UtcNow;

            var updatedCategory = await categoryRepository.UpdateCategoryAsync(category);
            return MapCategoryToDto(updatedCategory);
        }

        public async Task<bool> DeleteCategoryAsync(Guid id)
        {
            return await categoryRepository.DeleteCategoryAsync(id);
        }

        private static CategoryDto MapCategoryToDto(Category category)
        {
            return new CategoryDto
            {
                Id = category.Id.ToString(),
                Name = category.Name,
                CreatedAt = category.CreatedAt,
                UpdatedAt = category.UpdatedAt
            };
        }
    }
} 