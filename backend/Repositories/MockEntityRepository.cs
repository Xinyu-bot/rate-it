using backend.Models;

namespace backend.Repositories
{
    public class MockEntityRepository : IEntityRepository
    {
        private readonly List<Entity> _entities =
        [
            new Entity
            {
                Id = Guid.Parse("11111111-1111-1111-1111-111111111111"),
                Name = "Sample Hotel 1",
                Slug = "sample-hotel-1",
                CategoryId = Guid.Parse("11111111-1111-1111-1111-111111111111"),
                Description = "This is the sample hotel 1 of category 1 - hotel",
                CreatedBy = Guid.Empty,
                CreatedAt = DateTime.UtcNow.AddDays(-30),
                IsApproved = true
            },
            new Entity
            {
                Id = Guid.Parse("22222222-2222-2222-2222-222222222222"),
                Name = "Sample Hotel 2",
                Slug = "sample-hotel-2",
                CategoryId = Guid.Parse("11111111-1111-1111-1111-111111111111"),
                Description = "This is the sample hotel 2 of category 1 - hotel",
                CreatedBy = Guid.Empty,
                CreatedAt = DateTime.UtcNow.AddDays(-25),
                IsApproved = true
            }
        ];

        public Task<IEnumerable<Entity>> GetAllEntitiesAsync()
        {
            return Task.FromResult<IEnumerable<Entity>>(_entities);
        }

        public Task<Entity?> GetEntityByIdAsync(Guid id)
        {
            var entity = _entities.FirstOrDefault(e => e.Id == id);
            return Task.FromResult(entity);
        }

        public Task<IEnumerable<Entity>> GetEntitiesByCategoryIdAsync(Guid categoryId)
        {
            var entities = _entities.Where(e => e.CategoryId == categoryId).ToList();
            return Task.FromResult<IEnumerable<Entity>>(entities);
        }

        public Task<Entity> CreateEntityAsync(Entity entity)
        {
            if (entity.Id == Guid.Empty)
            {
                entity.Id = Guid.NewGuid();
            }
            
            entity.CreatedAt = DateTime.UtcNow;
            
            _entities.Add(entity);
            return Task.FromResult(entity);
        }

        public Task<Entity> UpdateEntityAsync(Entity entity)
        {
            var existingEntity = _entities.FirstOrDefault(e => e.Id == entity.Id);
            if (existingEntity == null)
            {
                throw new KeyNotFoundException($"Entity with ID {entity.Id} not found");
            }

            existingEntity.Name = entity.Name;
            existingEntity.Slug = entity.Slug;
            existingEntity.Description = entity.Description;
            existingEntity.IsApproved = entity.IsApproved;
            
            return Task.FromResult(existingEntity);
        }

        public Task<bool> DeleteEntityAsync(Guid id)
        {
            var entity = _entities.FirstOrDefault(e => e.Id == id);
            if (entity == null)
            {
                return Task.FromResult(false);
            }

            _entities.Remove(entity);
            return Task.FromResult(true);
        }
    }
} 