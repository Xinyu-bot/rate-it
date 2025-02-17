using System.Text.Json.Serialization;

namespace backend.Models
{
    public class UserMetadata
    {
        [JsonPropertyName("email")]
        public required string Email { get; set; }

        [JsonPropertyName("email_verified")]
        public bool EmailVerified { get; set; }

        [JsonPropertyName("phone_verified")]
        public bool PhoneVerified { get; set; }

        [JsonPropertyName("sub")]
        public required string Sub { get; set; }
    }
}
