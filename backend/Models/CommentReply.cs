using MongoDB.Bson;
using MongoDB.Bson.Serialization.Attributes;
using NUlid;

namespace backend.Models
{
    public class CommentReply
    {
        [BsonId]
        [BsonRepresentation(BsonType.String)]
        public string CommentReplyId { get; set; } = Ulid.NewUlid().ToString();

        [BsonElement("comment_thread_id")]
        [BsonRepresentation(BsonType.String)]
        public string CommentThreadId { get; set; } = string.Empty;

        [BsonElement("parent_reply_id")]
        [BsonRepresentation(BsonType.String)]
        public string? ParentReplyId { get; set; }

        [BsonElement("user_id")]
        [BsonRepresentation(BsonType.String)]
        public Guid UserId { get; set; }

        [BsonElement("content")]
        public string Content { get; set; } = string.Empty;

        [BsonElement("created_at")]
        public DateTime CreatedAt { get; set; } = DateTime.UtcNow;
    }
} 