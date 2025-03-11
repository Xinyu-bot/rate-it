using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;
using backend.Models;
using MongoDB.Driver;

namespace backend.Data
{
    public class MongoDBContext
    {
        private readonly IMongoDatabase _database;

        public MongoDBContext(IConfiguration configuration)
        {
            var connectionUri = Environment.GetEnvironmentVariable("MONGO_STRING");
            var settings = MongoClientSettings.FromConnectionString(connectionUri);
            settings.ServerApi = new ServerApi(ServerApiVersion.V1);
            var client = new MongoClient(settings);
            _database = client.GetDatabase(Environment.GetEnvironmentVariable("MONGO_APP_NAME"));
        }

        public IMongoCollection<CommentThread> CommentThreads => _database.GetCollection<CommentThread>("comment_thread");
        public IMongoCollection<CommentReply> CommentReplies => _database.GetCollection<CommentReply>("comment_reply");
        public IMongoCollection<Vote> Votes => _database.GetCollection<Vote>("vote");
    }
}