using System.Text.Json.Serialization;

namespace backend.DTOs
{
    public class VoteDto
    {
        [JsonPropertyName("entity_id")]
        public string EntityId { get; set; } = string.Empty;

        [JsonPropertyName("comment_thread_id")]
        public string CommentThreadId { get; set; } = string.Empty;

        [JsonPropertyName("vote_type")]
        public string VoteType { get; set; } = string.Empty;

        [JsonPropertyName("created_at")]
        public DateTime CreatedAt { get; set; }
    }

    public class VotesResponseDto
    {
        [JsonPropertyName("votes")]
        public List<VoteDto> Votes { get; set; } = [];
    }

    public class CreateVoteRequestDto
    {
        [JsonPropertyName("entity_id")]
        public required string EntityId { get; set; }

        [JsonPropertyName("comment_thread_id")]
        public required string CommentThreadId { get; set; }

        [JsonPropertyName("vote_type")]
        public required string VoteType { get; set; }
    }

    public class UpdateVoteRequestDto
    {
        [JsonPropertyName("vote_type")]
        public required string VoteType { get; set; }
    }
} 