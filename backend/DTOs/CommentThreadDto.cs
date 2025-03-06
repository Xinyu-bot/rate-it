using System.Text.Json.Serialization;

namespace backend.DTOs
{
    public class CommentThreadDto
    {
        [JsonPropertyName("comment_thread_id")]
        public string CommentThreadId { get; set; } = string.Empty;

        [JsonPropertyName("entity_id")]
        public string EntityId { get; set; } = string.Empty;

        [JsonPropertyName("user_id")]
        public string UserId { get; set; } = string.Empty;

        [JsonPropertyName("rating")]
        public int Rating { get; set; }

        [JsonPropertyName("content")]
        public string Content { get; set; } = string.Empty;

        [JsonPropertyName("created_at")]
        public DateTime CreatedAt { get; set; }

        [JsonPropertyName("upvote_count")]
        public int UpvoteCount { get; set; }

        [JsonPropertyName("downvote_count")]
        public int DownvoteCount { get; set; }

        [JsonPropertyName("replies_count")]
        public int RepliesCount { get; set; }

        [JsonPropertyName("my_vote_status")]
        public int MyVoteStatus { get; set; } = 0; // 0: no vote, 1: upvote, 2: downvote
    }

    public class CommentThreadsResponseDto
    {
        [JsonPropertyName("comment_threads")]
        public List<CommentThreadDto> CommentThreads { get; set; } = [];
    }

    public class CreateCommentThreadRequestDto
    {
        [JsonPropertyName("entity_id")]
        public required string EntityId { get; set; }

        [JsonPropertyName("rating")]
        public required int Rating { get; set; }

        [JsonPropertyName("content")]
        public required string Content { get; set; }
    }

    public class UpdateCommentThreadRequestDto
    {
        [JsonPropertyName("rating")]
        public int? Rating { get; set; }

        [JsonPropertyName("content")]
        public string? Content { get; set; }
    }
} 