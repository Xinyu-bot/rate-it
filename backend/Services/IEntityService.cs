using backend.DTOs;

namespace backend.Services
{
    public interface IEntityService
    {
        Task<IEnumerable<EntityDto>> GetAllEntitiesAsync();
        Task<EntityDto?> GetEntityByIdAsync(Guid id);
        Task<IEnumerable<EntityDto>> GetEntitiesByCategoryIdAsync(Guid categoryId);
        Task<EntityDto> CreateEntityAsync(CreateEntityRequestDto createEntityDto, Guid createdBy);
        Task<EntityDto> UpdateEntityAsync(Guid id, UpdateEntityRequestDto updateEntityDto);
        Task<bool> DeleteEntityAsync(Guid id);
    }
} 