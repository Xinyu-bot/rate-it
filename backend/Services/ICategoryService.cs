using backend.DTOs;
using backend.Models;

namespace backend.Services
{
    public interface ICategoryService
    {
        Task<IEnumerable<CategoryDto>> GetAllCategoriesAsync();
        Task<CategoryDto?> GetCategoryByIdAsync(Guid id);
        Task<CategoryDto> CreateCategoryAsync(string name);
        Task<CategoryDto> UpdateCategoryAsync(Guid id, string name);
        Task<bool> DeleteCategoryAsync(Guid id);
    }
} 