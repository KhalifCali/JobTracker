using Microsoft.EntityFrameworkCore;

var builder = WebApplication.CreateBuilder(args);

// Add services
builder.Services.AddOpenApi();

builder.Services.ConfigureHttpJsonOptions(options =>
{
    options.SerializerOptions.Converters.Add(
        new System.Text.Json.Serialization.JsonStringEnumConverter());
});

builder.Services.AddCors(options =>
{
    options.AddPolicy("AllowFrontend",
        policy =>
        {
            policy.WithOrigins("http://localhost:5173")
                  .AllowAnyHeader()
                  .AllowAnyMethod();
        });
});

// Db
builder.Services.AddDbContext<AppDbContext>(options =>
    options.UseInMemoryDatabase("JobTrackerDb"));

var app = builder.Build();


// Configure pipeline
if (app.Environment.IsDevelopment())
{
    app.MapOpenApi();
}


app.UseCors("AllowFrontend");

app.UseHttpsRedirection();

app.ApiEndPoints();


app.Run();