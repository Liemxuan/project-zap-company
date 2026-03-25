using Microsoft.EntityFrameworkCore;
using Olympus.Data.Contexts;

var builder = WebApplication.CreateBuilder(args);

// Add services to the container.
builder.Services.AddEndpointsApiExplorer();
builder.Services.AddSwaggerGen();

// Relational DB (PostgreSQL)
builder.Services.AddDbContext<ApplicationDbContext>(options =>
    options.UseNpgsql(builder.Configuration.GetConnectionString("PostgresConnection")));

// Document DB (MongoDB)
builder.Services.AddSingleton<MongoContext>();

var app = builder.Build();

// Configure the HTTP request pipeline.
if (app.Environment.IsDevelopment())
{
    app.UseSwagger();
    app.UseSwaggerUI();
}

app.UseHttpsRedirection();

// Infrastructure Health Check
app.MapGet("/health", async (ApplicationDbContext pgContext, MongoContext mgContext) =>
{
    var pgAlive = await pgContext.Database.CanConnectAsync();
    // Simple Mongo check
    var mgAlive = mgContext.MemoryFacts != null;

    return Results.Ok(new 
    { 
        Status = "Healthy", 
        PostgreSQL = pgAlive ? "Connected" : "Disconnected",
        MongoDB = mgAlive ? "Connected" : "Ready"
    });
});

app.Run();
