using Backend.Services;
using Microsoft.EntityFrameworkCore;
using Microsoft.AspNetCore.Authentication.JwtBearer;
using Microsoft.IdentityModel.Tokens;
using WSB_Happy_Leash_project.Data.Context;
using System.Text;


var builder = WebApplication.CreateBuilder(args);

builder.Services.AddControllers();

//TODO czy corsy są poprawnie napisane?
builder.Services.AddCors(options =>
{
    options.AddPolicy("ReactNativePolicy", policy =>
    {
        policy.WithOrigins(
            "http://localhost:8081",    // iOS Simulator
            "http://10.0.2.2:8081"      // Android Emulator
        )
        .AllowAnyHeader()
        .AllowAnyMethod();
    });
});


builder.Services.AddAuthentication(JwtBearerDefaults.AuthenticationScheme)
    .AddJwtBearer(options =>
    {
        options.TokenValidationParameters = new TokenValidationParameters
        {
            ValidateIssuerSigningKey = true,
            IssuerSigningKey = new SymmetricSecurityKey(Encoding.ASCII.GetBytes(Environment.GetEnvironmentVariable("JWT_SECRET"))),
            ValidateIssuer = false,
            ValidateAudience = false
        };
    });

builder.Services.AddDbContext<AppDbContext>(options =>
    options.UseSqlServer(builder.Configuration.GetConnectionString("DbContext")
        ?? throw new InvalidOperationException("Connection string 'DbContext' not found.")));

builder.Services.AddEndpointsApiExplorer();
builder.Services.AddSwaggerGen(); // lub builder.Services.AddOpenApi();
builder.Services.AddScoped<JwtService>();



DotNetEnv.Env.Load();

var app = builder.Build();

if (app.Environment.IsDevelopment())
{
    app.UseSwagger();
    app.UseSwaggerUI(); // lub app.MapOpenApi();
}

app.UseCors("ReactNativePolicy");
app.UseAuthentication();
app.UseAuthorization();
app.UseHttpsRedirection();
app.MapControllers();
app.UseStaticFiles();
app.Run();
