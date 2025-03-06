using System.Text.Json.Serialization;

namespace backend.DTOs
{
    public class UserDetailDto
    {
        [JsonPropertyName("id")]
        public Guid UserId { get; set; }

        [JsonPropertyName("username")]
        public string UserName { get; set; } = string.Empty;

        [JsonPropertyName("level")]
        public int Level { get; set; } = 1;

        [JsonPropertyName("user_point_balance")]
        public long UserPointsBalance { get; set; }

        [JsonPropertyName("role")]
        public int UserPermission { get; set; }

        [JsonPropertyName("status")]
        public int UserStatus { get; set; }

        [JsonPropertyName("profile_picture")]
        public string ProfilePicture { get; set; } = "https://gravatar.com/avatar/f52cd01a44c15eef1628ae9fc7325b55?s=400&d=robohash&r=x";

        [JsonPropertyName("created_at")]
        public DateTime CreatedAt { get; set; }

        [JsonPropertyName("updated_at")]
        public DateTime UpdatedAt { get; set; }
    }
} 