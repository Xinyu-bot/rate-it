using System.Text.Json.Serialization;

namespace backend.DTOs
{
    public class CategoryDto
    {
        [JsonPropertyName("id")]
        public string Id { get; set; } = string.Empty;

        [JsonPropertyName("name")]
        public string Name { get; set; } = string.Empty;

        [JsonPropertyName("created_at")]
        public DateTime CreatedAt { get; set; }

        [JsonPropertyName("updated_at")]
        public DateTime UpdatedAt { get; set; }
    }

    public class CategoriesResponseDto
    {
        [JsonPropertyName("categories")]
        public List<CategoryDto> Categories { get; set; } = [];
    }
} 