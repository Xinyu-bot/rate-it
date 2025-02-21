using System.Text.Json.Serialization;

namespace backend.DTOs
{
    public class UserDetailDto
    {
        [JsonPropertyName("user_id")]
        public Guid UserId { get; set; }

        [JsonPropertyName("user_name")]
        public string? UserName { get; set; }

        [JsonPropertyName("balance")]
        public long UserPointsBalance { get; set; }

        [JsonPropertyName("permission")]
        public int UserPermission { get; set; }

        [JsonPropertyName("status")]
        public int UserStatus { get; set; }
    }
}
