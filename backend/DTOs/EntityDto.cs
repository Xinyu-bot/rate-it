using System.Text.Json.Serialization;

namespace backend.DTOs
{
    public class EntityDto
    {
        [JsonPropertyName("id")]
        public string Id { get; set; } = string.Empty;

        [JsonPropertyName("name")]
        public string Name { get; set; } = string.Empty;

        [JsonPropertyName("slug")]
        public string Slug { get; set; } = string.Empty;

        [JsonPropertyName("category_id")]
        public string CategoryId { get; set; } = string.Empty;

        [JsonPropertyName("description")]
        public string? Description { get; set; }

        [JsonPropertyName("created_by")]
        public Guid CreatedBy { get; set; }

        [JsonPropertyName("created_at")]
        public DateTime CreatedAt { get; set; }

        [JsonPropertyName("is_approved")]
        public bool IsApproved { get; set; }
    }

    public class EntitiesResponseDto
    {
        [JsonPropertyName("entities")]
        public List<EntityDto> Entities { get; set; } = [];
    }

    public class CreateEntityRequestDto
    {
        [JsonPropertyName("name")]
        public required string Name { get; set; }

        [JsonPropertyName("slug")]
        public string? Slug { get; set; }

        [JsonPropertyName("category_id")]
        public required string CategoryId { get; set; }

        [JsonPropertyName("description")]
        public string? Description { get; set; }
    }

    public class UpdateEntityRequestDto
    {
        [JsonPropertyName("name")]
        public string? Name { get; set; }

        [JsonPropertyName("slug")]
        public string? Slug { get; set; }

        [JsonPropertyName("description")]
        public string? Description { get; set; }

        [JsonPropertyName("is_approved")]
        public bool? IsApproved { get; set; }
    }
} 