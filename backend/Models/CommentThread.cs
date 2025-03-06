using MongoDB.Bson;
using MongoDB.Bson.Serialization.Attributes;
using NUlid;

namespace backend.Models
{
    public class CommentThread
    {
        [BsonId]
        [BsonRepresentation(BsonType.String)]
        public string CommentThreadId { get; set; } = Ulid.NewUlid().ToString();

        [BsonElement("entity_id")]
        [BsonRepresentation(BsonType.String)]
        public Guid EntityId { get; set; }

        [BsonElement("user_id")]
        [BsonRepresentation(BsonType.String)]
        public Guid UserId { get; set; }

        [BsonElement("rating")]
        public int Rating { get; set; }

        [BsonElement("content")]
        public string Content { get; set; } = string.Empty;

        [BsonElement("created_at")]
        public DateTime CreatedAt { get; set; } = DateTime.UtcNow;

        [BsonElement("upvote_count")]
        public int UpvoteCount { get; set; } = 0;

        [BsonElement("downvote_count")]
        public int DownvoteCount { get; set; } = 0;

        [BsonElement("replies_count")]
        public int RepliesCount { get; set; } = 0;
    }
} 