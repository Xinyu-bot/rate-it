using System.Text.Json.Serialization;

namespace backend.DTOs
{
    public class CommentReplyDto
    {
        [JsonPropertyName("comment_reply_id")]
        public string CommentReplyId { get; set; } = string.Empty;

        [JsonPropertyName("comment_thread_id")]
        public string CommentThreadId { get; set; } = string.Empty;

        [JsonPropertyName("parent_reply_id")]
        public string? ParentReplyId { get; set; }

        [JsonPropertyName("user_id")]
        public string UserId { get; set; } = string.Empty;

        [JsonPropertyName("content")]
        public string Content { get; set; } = string.Empty;

        [JsonPropertyName("created_at")]
        public DateTime CreatedAt { get; set; }
    }

    public class CommentRepliesResponseDto
    {
        [JsonPropertyName("comment_replies")]
        public List<CommentReplyDto> CommentReplies { get; set; } = [];
    }

    public class CreateCommentReplyRequestDto
    {
        [JsonPropertyName("comment_thread_id")]
        public required string CommentThreadId { get; set; }

        [JsonPropertyName("parent_reply_id")]
        public string? ParentReplyId { get; set; }

        [JsonPropertyName("content")]
        public required string Content { get; set; }
    }

    public class UpdateCommentReplyRequestDto
    {
        [JsonPropertyName("content")]
        public required string Content { get; set; }
    }
} 