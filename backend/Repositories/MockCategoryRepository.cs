using backend.Models;

namespace backend.Repositories
{
    public class MockCategoryRepository : ICategoryRepository
    {
        private readonly List<Category> _categories =
        [
            new Category
            {
                Id = Guid.Parse("11111111-1111-1111-1111-111111111111"),
                Name = "hotel",
                CreatedAt = DateTime.UtcNow.AddDays(-30),
                UpdatedAt = DateTime.UtcNow.AddDays(-30)
            },
            new Category
            {
                Id = Guid.Parse("22222222-2222-2222-2222-222222222222"),
                Name = "restaurant",
                CreatedAt = DateTime.UtcNow.AddDays(-30),
                UpdatedAt = DateTime.UtcNow.AddDays(-30)
            }
        ];

        public Task<IEnumerable<Category>> GetAllCategoriesAsync()
        {
            return Task.FromResult<IEnumerable<Category>>(_categories);
        }

        public Task<Category?> GetCategoryByIdAsync(Guid id)
        {
            var category = _categories.FirstOrDefault(c => c.Id == id);
            return Task.FromResult(category);
        }

        public Task<Category> CreateCategoryAsync(Category category)
        {
            if (category.Id == Guid.Empty)
            {
                category.Id = Guid.NewGuid();
            }
            
            category.CreatedAt = DateTime.UtcNow;
            category.UpdatedAt = DateTime.UtcNow;
            
            _categories.Add(category);
            return Task.FromResult(category);
        }

        public Task<Category> UpdateCategoryAsync(Category category)
        {
            var existingCategory = _categories.FirstOrDefault(c => c.Id == category.Id);
            if (existingCategory == null)
            {
                throw new KeyNotFoundException($"Category with ID {category.Id} not found");
            }

            existingCategory.Name = category.Name;
            existingCategory.UpdatedAt = DateTime.UtcNow;
            
            return Task.FromResult(existingCategory);
        }

        public Task<bool> DeleteCategoryAsync(Guid id)
        {
            var category = _categories.FirstOrDefault(c => c.Id == id);
            if (category == null)
            {
                return Task.FromResult(false);
            }

            _categories.Remove(category);
            return Task.FromResult(true);
        }
    }
} 