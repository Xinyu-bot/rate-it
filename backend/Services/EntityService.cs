using backend.DTOs;
using backend.Models;
using backend.Repositories;
using System.Text.RegularExpressions;

namespace backend.Services
{
    public class EntityService(IEntityRepository entityRepository) : IEntityService
    {
        public async Task<IEnumerable<EntityDto>> GetAllEntitiesAsync()
        {
            var entities = await entityRepository.GetAllEntitiesAsync();
            return entities.Select(MapEntityToDto);
        }

        public async Task<EntityDto?> GetEntityByIdAsync(Guid id)
        {
            var entity = await entityRepository.GetEntityByIdAsync(id);
            return entity != null ? MapEntityToDto(entity) : null;
        }

        public async Task<IEnumerable<EntityDto>> GetEntitiesByCategoryIdAsync(Guid categoryId)
        {
            var entities = await entityRepository.GetEntitiesByCategoryIdAsync(categoryId);
            return entities.Select(MapEntityToDto);
        }

        public async Task<EntityDto> CreateEntityAsync(CreateEntityRequestDto createEntityDto, Guid createdBy)
        {
            var entity = new Entity
            {
                Name = createEntityDto.Name,
                Slug = !string.IsNullOrEmpty(createEntityDto.Slug) 
                    ? createEntityDto.Slug 
                    : GenerateSlug(createEntityDto.Name),
                CategoryId = Guid.Parse(createEntityDto.CategoryId),
                Description = createEntityDto.Description,
                CreatedBy = createdBy,
                CreatedAt = DateTime.UtcNow,
                IsApproved = false // New entities are not approved by default
            };

            var createdEntity = await entityRepository.CreateEntityAsync(entity);
            return MapEntityToDto(createdEntity);
        }

        public async Task<EntityDto> UpdateEntityAsync(Guid id, UpdateEntityRequestDto updateEntityDto)
        {
            var entity = await entityRepository.GetEntityByIdAsync(id);
            if (entity == null)
            {
                throw new KeyNotFoundException($"Entity with ID {id} not found");
            }

            if (!string.IsNullOrEmpty(updateEntityDto.Name))
            {
                entity.Name = updateEntityDto.Name;
            }

            if (!string.IsNullOrEmpty(updateEntityDto.Slug))
            {
                entity.Slug = updateEntityDto.Slug;
            }
            else if (!string.IsNullOrEmpty(updateEntityDto.Name))
            {
                entity.Slug = GenerateSlug(updateEntityDto.Name);
            }

            if (updateEntityDto.Description != null)
            {
                entity.Description = updateEntityDto.Description;
            }

            if (updateEntityDto.IsApproved.HasValue)
            {
                entity.IsApproved = updateEntityDto.IsApproved.Value;
            }

            var updatedEntity = await entityRepository.UpdateEntityAsync(entity);
            return MapEntityToDto(updatedEntity);
        }

        public async Task<bool> DeleteEntityAsync(Guid id)
        {
            return await entityRepository.DeleteEntityAsync(id);
        }

        private static EntityDto MapEntityToDto(Entity entity)
        {
            return new EntityDto
            {
                Id = entity.Id.ToString(),
                Name = entity.Name,
                Slug = entity.Slug,
                CategoryId = entity.CategoryId.ToString(),
                Description = entity.Description,
                CreatedBy = entity.CreatedBy,
                CreatedAt = entity.CreatedAt,
                IsApproved = entity.IsApproved
            };
        }

        private static string GenerateSlug(string name)
        {
            // Convert to lowercase
            string slug = name.ToLowerInvariant();

            // Remove accents
            slug = Regex.Replace(slug, @"[^a-z0-9\s-]", "");

            // Replace spaces with hyphens
            slug = Regex.Replace(slug, @"\s+", "-");

            // Remove multiple hyphens
            slug = Regex.Replace(slug, @"-+", "-");

            // Trim hyphens from start and end
            slug = slug.Trim('-');

            return slug;
        }
    }
} 