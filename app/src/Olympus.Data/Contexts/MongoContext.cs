using Microsoft.Extensions.Configuration;
using MongoDB.Driver;
using Olympus.Core.Entities;

namespace Olympus.Data.Contexts;

public class MongoContext
{
    private readonly IMongoDatabase _database;

    public MongoContext(IConfiguration configuration)
    {
        var connectionString = configuration.GetConnectionString("MongoConnection");
        var client = new MongoClient(connectionString);
        _database = client.GetDatabase("OlympusBrain");
    }

    public IMongoCollection<MemoryFact> MemoryFacts => _database.GetCollection<MemoryFact>("MemoryFacts");
}
