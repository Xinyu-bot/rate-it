using MongoDB.Bson;
using MongoDB.Bson.Serialization.Attributes;

namespace backend.Models
{
    public class Vote
    {
        [BsonId]
        [BsonRepresentation(BsonType.ObjectId)]
        public string Id { get; set; } = ObjectId.GenerateNewId().ToString();

        [BsonElement("entity_id")]
        [BsonRepresentation(BsonType.String)]
        public Guid EntityId { get; set; }

        [BsonElement("comment_thread_id")]
        [BsonRepresentation(BsonType.String)]
        public string CommentThreadId { get; set; } = string.Empty;

        [BsonElement("user_id")]
        [BsonRepresentation(BsonType.String)]
        public Guid UserId { get; set; }

        [BsonElement("vote_type")]
        public string VoteType { get; set; } = string.Empty; // "upvote" or "downvote"

        [BsonElement("created_at")]
        public DateTime CreatedAt { get; set; } = DateTime.UtcNow;
    }
} 