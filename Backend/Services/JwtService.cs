using System;
using System.IdentityModel.Tokens.Jwt;
using System.Security.Claims;
using System.Text;
using Microsoft.IdentityModel.Tokens;
using WSB_Happy_Leash_project.Data.Models;

namespace Backend.Services
{


    public class JwtService
    {
        private readonly string _secretKey;
        private readonly int _expirationDays;
        public JwtService()
        {
            _secretKey = Environment.GetEnvironmentVariable("JWT_SECRET")
                         ?? throw new Exception("Zmienna środowiskowa JWT_SECRET nie została ustawiona.");

            var expirationDaysString = Environment.GetEnvironmentVariable("JWT_EXPIRATION_DAYS")
                ?? throw new Exception("Zmienna środowiskowa JWT_EXPIRATION_DAYS nie została ustawiona.");

            _expirationDays = int.Parse(expirationDaysString);
        }
        public string GenerateToken(User user)
        {
            var claims = new List<Claim>
            {
                new Claim("id", user.Id.ToString()),
                new Claim("role", user.UserType.ToString()),
                new Claim("firstName", user.FirstName),
                new Claim("lastName", user.LastName),
                new Claim("profilePictureURL", user.ProfilePictureURL??""),
            };

            var tokenDescriptor = new SecurityTokenDescriptor
            {
                Subject = new ClaimsIdentity(claims),
                Expires = DateTime.UtcNow.AddDays(_expirationDays),
                SigningCredentials = new SigningCredentials(new SymmetricSecurityKey(Encoding.ASCII.GetBytes(_secretKey)), SecurityAlgorithms.HmacSha256Signature)
            };

            var tokenHandler = new JwtSecurityTokenHandler();
            var token = tokenHandler.CreateToken(tokenDescriptor);

            return new JwtSecurityTokenHandler().WriteToken(token);
        }

        public bool ValidateToken(string token)
        {
            var tokenHandler = new JwtSecurityTokenHandler();
            var validationParameters = new TokenValidationParameters
            {
                ValidateIssuerSigningKey = true,
                IssuerSigningKey = new SymmetricSecurityKey(Encoding.ASCII.GetBytes(_secretKey)),
                ValidateIssuer = false,
                ValidateAudience = false,
            };

            try
            {
                var principal = tokenHandler.ValidateToken(token, validationParameters, out _);
                return true;
            }
            catch (Exception ex)
            {
                Console.WriteLine(ex.Message);
                return false;
            }
        }
    }
}