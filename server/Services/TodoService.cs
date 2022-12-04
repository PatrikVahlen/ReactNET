using TodoApi.Models;
using Microsoft.Extensions.Options;
using MongoDB.Driver;

namespace TodoApi.Services;

public class TodosService
{
    private readonly IMongoCollection<Todo> _todosCollection;

    public TodosService(
        IOptions<TodoDatabaseSettings> todoDatabaseSettings)
    {
        var mongoClient = new MongoClient(
            todoDatabaseSettings.Value.ConnectionString);

        var mongoDatabase = mongoClient.GetDatabase(
            todoDatabaseSettings.Value.DatabaseName);

        _todosCollection = mongoDatabase.GetCollection<Todo>(
            todoDatabaseSettings.Value.TodosCollectionName);
    }

    public async Task<List<Todo>> GetAsync() =>
        await _todosCollection.Find(_ => true).ToListAsync();

    public async Task<Todo?> GetAsync(string id) =>
        await _todosCollection.Find(x => x.Id == id).FirstOrDefaultAsync();

    public async Task CreateAsync(Todo newTodo) =>
        await _todosCollection.InsertOneAsync(newTodo);

    public async Task UpdateAsync(string id, Todo updatedTodo) =>
        await _todosCollection.ReplaceOneAsync(x => x.Id == id, updatedTodo);

    public async Task RemoveAsync(string id) =>
        await _todosCollection.DeleteOneAsync(x => x.Id == id);
}