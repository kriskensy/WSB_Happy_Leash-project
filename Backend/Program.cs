var builder = WebApplication.CreateBuilder(args);


builder.Services.AddControllers(); 

builder.Services.AddCors(options =>
{
    options.AddPolicy("AllowAllOrigins", policy =>
        policy.AllowAnyOrigin().AllowAnyMethod().AllowAnyHeader());
});


builder.Services.AddOpenApi();

var app = builder.Build();

if (app.Environment.IsDevelopment())
{
    app.MapOpenApi();
}

app.UseCors("AllowAllOrigins"); 

app.UseHttpsRedirection();

app.MapControllers(); 

app.Run();

