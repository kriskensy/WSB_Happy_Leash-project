using Microsoft.EntityFrameworkCore;
using Microsoft.OpenApi.Models;
using WSB_Happy_Leash_project.Data.Context;

var builder = WebApplication.CreateBuilder(args);

builder.Services.AddControllers(); 

builder.Services.AddCors(options =>
{
    options.AddPolicy("AllowAllOrigins", policy =>
        policy.AllowAnyOrigin().AllowAnyMethod().AllowAnyHeader());
});

builder.Services.AddDbContext<AppDbContext>(options =>
    options.UseSqlServer(builder.Configuration.GetConnectionString("DbContext") 
        ?? throw new InvalidOperationException("Connection string 'DbContext' not found.")));

builder.Services.AddEndpointsApiExplorer();
builder.Services.AddSwaggerGen(); // lub builder.Services.AddOpenApi();

var app = builder.Build();

if (app.Environment.IsDevelopment())
{
    app.UseSwagger();
    app.UseSwaggerUI(); // lub app.MapOpenApi();
}

app.UseCors("AllowAllOrigins"); 

app.UseHttpsRedirection();

app.MapControllers(); 

app.Run();
