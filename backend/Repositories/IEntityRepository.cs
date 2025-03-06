using backend.Models;

namespace backend.Repositories
{
    public interface IEntityRepository
    {
        Task<IEnumerable<Entity>> GetAllEntitiesAsync();
        Task<Entity?> GetEntityByIdAsync(Guid id);
        Task<IEnumerable<Entity>> GetEntitiesByCategoryIdAsync(Guid categoryId);
        Task<Entity> CreateEntityAsync(Entity entity);
        Task<Entity> UpdateEntityAsync(Entity entity);
        Task<bool> DeleteEntityAsync(Guid id);
    }
} 