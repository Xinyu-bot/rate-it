using backend.Models;
using MongoDB.Driver;

namespace backend.Data
{
    public class MongoDBContext
    {
        private readonly IMongoDatabase _database;

        public MongoDBContext()
        {
            var connectionUri = Environment.GetEnvironmentVariable("MONGO_STRING");
            Console.WriteLine("connectionUri: " + connectionUri);
            var settings = MongoClientSettings.FromConnectionString(connectionUri);
            settings.ServerApi = new ServerApi(ServerApiVersion.V1);
            var client = new MongoClient(settings);
            _database = client.GetDatabase("rate-it");
        }

        public IMongoDatabase Database => _database;
        public IMongoCollection<CommentThread> CommentThreads => _database.GetCollection<CommentThread>("comment_thread");
        public IMongoCollection<CommentReply> CommentReplies => _database.GetCollection<CommentReply>("comment_reply");
        public IMongoCollection<Vote> Votes => _database.GetCollection<Vote>("vote");
    }
}