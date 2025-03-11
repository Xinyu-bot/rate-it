using backend.Models;
using backend.Data;
using Microsoft.EntityFrameworkCore;
using System;
using System.Collections.Generic;
using System.Threading.Tasks;

namespace backend.Repositories
{
    public class CategoryRepository : ICategoryRepository
    {
        private readonly UserDetailDbContext _context;

        public CategoryRepository(UserDetailDbContext context)
        {
            _context = context;
        }

        public async Task<IEnumerable<Category>> GetAllCategoriesAsync()
        {
            return await _context.Set<Category>().ToListAsync();
        }

        public async Task<Category?> GetCategoryByIdAsync(Guid id)
        {
            return await _context.Set<Category>().FindAsync(id);
        }

        public async Task<Category> CreateCategoryAsync(Category category)
        {
            if (category.Id == Guid.Empty)
            {
                category.Id = Guid.NewGuid();
            }
            
            category.CreatedAt = DateTime.UtcNow;
            category.UpdatedAt = DateTime.UtcNow;
            
            _context.Set<Category>().Add(category);
            await _context.SaveChangesAsync();
            
            return category;
        }

        public async Task<Category> UpdateCategoryAsync(Category category)
        {
            category.UpdatedAt = DateTime.UtcNow;
            
            _context.Set<Category>().Update(category);
            await _context.SaveChangesAsync();
            
            return category;
        }

        public async Task<bool> DeleteCategoryAsync(Guid id)
        {
            var category = await _context.Set<Category>().FindAsync(id);
            if (category == null)
            {
                return false;
            }
            
            _context.Set<Category>().Remove(category);
            await _context.SaveChangesAsync();
            
            return true;
        }
    }
} 