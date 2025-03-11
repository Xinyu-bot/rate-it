using backend.Models;
using backend.Data;
using Microsoft.EntityFrameworkCore;
using System;
using System.Collections.Generic;
using System.Threading.Tasks;
using System.Linq;

namespace backend.Repositories
{
    public class EntityRepository : IEntityRepository
    {
        private readonly UserDetailDbContext _context;

        public EntityRepository(UserDetailDbContext context)
        {
            _context = context;
        }

        public async Task<IEnumerable<Entity>> GetAllEntitiesAsync()
        {
            return await _context.Set<Entity>().ToListAsync();
        }

        public async Task<Entity?> GetEntityByIdAsync(Guid id)
        {
            return await _context.Set<Entity>().FindAsync(id);
        }

        public async Task<IEnumerable<Entity>> GetEntitiesByCategoryIdAsync(Guid categoryId)
        {
            return await _context.Set<Entity>()
                .Where(e => e.CategoryId == categoryId)
                .ToListAsync();
        }

        public async Task<Entity> CreateEntityAsync(Entity entity)
        {
            if (entity.Id == Guid.Empty)
            {
                entity.Id = Guid.NewGuid();
            }
            
            entity.CreatedAt = DateTime.UtcNow;
            
            _context.Set<Entity>().Add(entity);
            await _context.SaveChangesAsync();
            
            return entity;
        }

        public async Task<Entity> UpdateEntityAsync(Entity entity)
        {
            _context.Set<Entity>().Update(entity);
            await _context.SaveChangesAsync();
            
            return entity;
        }

        public async Task<bool> DeleteEntityAsync(Guid id)
        {
            var entity = await _context.Set<Entity>().FindAsync(id);
            if (entity == null)
            {
                return false;
            }
            
            _context.Set<Entity>().Remove(entity);
            await _context.SaveChangesAsync();
            
            return true;
        }
    }
} 