using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using WSB_Happy_Leash_project.Data.Context;
using System.Security.Cryptography;
using WSB_Happy_Leash_project.Data.Models;
using Backend.Services;

namespace Backend.Controllers
{
    [Route("api/auth")]
    [ApiController]
    public class AuthController : ControllerBase
    {
        private readonly AppDbContext _context;
        private readonly JwtService _jwtService;
        public AuthController(AppDbContext context, JwtService jwtService)
        {
            _context = context;
            _jwtService = jwtService;
        }

        [HttpPost("login")]
        public async Task<IActionResult> Login([FromForm] string login, [FromForm] string password)
        {
            if (string.IsNullOrEmpty(login) || string.IsNullOrEmpty(password))
            {
                return BadRequest(new { message = "Login and password are required" });
            }

            var user = await _context.Users.FirstOrDefaultAsync(x => x.Login == login && x.PasswordHash == HashPassword(password));
            if (user == null)
            {
                return NotFound(new { message = "User not found" });
            }

            System.Console.WriteLine(_jwtService.GenerateToken(user));
            return Ok(new
            {
                message = "Login successful",
                userToken = _jwtService.GenerateToken(user),
            });
        }


        // GET: api/users
        [HttpGet("users")]
        public async Task<ActionResult<IEnumerable<User>>> GetUsers()
        {
            System.Console.WriteLine("GetUsers");
            return await _context.Users.ToListAsync();
        }


        [HttpPost("register")]
        public async Task<IActionResult> Register([FromForm] RegisterRequest request)
        {
            if (string.IsNullOrWhiteSpace(request.Login) ||
                string.IsNullOrWhiteSpace(request.Password) ||
                string.IsNullOrWhiteSpace(request.FirstName) ||
                string.IsNullOrWhiteSpace(request.LastName) ||
                string.IsNullOrWhiteSpace(request.Email))
            {
                return BadRequest(new { message = "All required fields must be provided" });
            }

            var existingUser = await _context.Users.FirstOrDefaultAsync(x => x.Login == request.Login || x.Email == request.Email);
            if (existingUser != null)
            {
                return Conflict(new { message = "User with this login or email already exists" });
            }

            var newUser = new User
            {
                Login = request.Login,
                PasswordHash = HashPassword(request.Password),
                FirstName = request.FirstName,
                LastName = request.LastName,
                Email = request.Email,
                PhoneNumber = request.PhoneNumber,
                Address = request.Address,
                City = request.City,
                PostalCode = request.PostalCode,
                Country = request.Country,
                ProfilePictureURL = request.ProfilePictureURL,
                CreatedAt = DateTime.UtcNow,
                UserType = UserType.User
            };

            _context.Users.Add(newUser);
            await _context.SaveChangesAsync();

            return CreatedAtAction(nameof(Login), new { login = request.Login },
                new { message = "User created successfully" });
        }

        // GET: api/user/{id} //TODO ta metoda została dodana, żeby ogarniała dane do widoku edycji konta dla usera. Aktualnie działa.
        [HttpGet("user/{id}")]
        public async Task<IActionResult> GetUser(int id)
        {
            var user = await _context.Users.FirstOrDefaultAsync(item => item.Id == id);
            if (user == null)
            {
                return NotFound(new { message = "User not found" });
            }

            //bez zwracania hasła
            return Ok(new
            {
                id = user.Id,
                firstName = user.FirstName,
                lastName = user.LastName,
                login = user.Login,
                email = user.Email,
                phoneNumber = user.PhoneNumber,
                address = user.Address,
                city = user.City,
                postalCode = user.PostalCode,
                country = user.Country,
                profilePictureURL = user.ProfilePictureURL,
                userType = user.UserType.ToString()
            });
        }


        [HttpPut("edit/{id}")]
        public async Task<IActionResult> Edit([FromForm] int id, [FromForm] RegisterRequest request)
        {
            if (string.IsNullOrWhiteSpace(request.Login) ||
                string.IsNullOrWhiteSpace(request.FirstName) ||
                string.IsNullOrWhiteSpace(request.LastName) ||
                string.IsNullOrWhiteSpace(request.Email))
            {
                return BadRequest(new { message = "All required fields must be provided" });
            }

            var user = await _context.Users.FirstOrDefaultAsync(x => x.Id == id);
            if (user == null)
            {
                return NotFound(new { message = "User not found" });
            }

            // Sprawdź, czy nowy login lub e-mail nie należy do innego użytkownika
            var duplicateUser = await _context.Users.FirstOrDefaultAsync(x =>
                (x.Login == request.Login || x.Email == request.Email) && x.Id != id);

            if (duplicateUser != null)
            {
                return Conflict(new { message = "Another user with this login or email already exists" });
            }

            // Aktualizuj dane
            user.Login = request.Login;
            user.FirstName = request.FirstName;
            user.LastName = request.LastName;
            user.Email = request.Email;
            user.PhoneNumber = request.PhoneNumber;
            user.Address = request.Address;
            user.City = request.City;
            user.PostalCode = request.PostalCode;
            user.Country = request.Country;
            user.ProfilePictureURL = request.ProfilePictureURL;

            // Jeśli podano nowe hasło, zaktualizuj
            if (!string.IsNullOrWhiteSpace(request.Password))
            {
                user.PasswordHash = HashPassword(request.Password);
            }

            await _context.SaveChangesAsync();

            return Ok(new { message = "User updated successfully" });
        }

        [HttpDelete("delete/{id}")]
        public async Task<IActionResult> Delete(int id)
        {
            var user = await _context.Users.FirstOrDefaultAsync(x => x.Id == id);
            if (user == null)
            {
                return NotFound(new { message = "User not found" });
            }

            _context.Users.Remove(user);
            await _context.SaveChangesAsync();

            return Ok(new { message = "User deleted successfully" });
        }

        private string HashPassword(string password)
        {
            using (var sha256 = SHA256.Create())
            {
                var bytes = sha256.ComputeHash(System.Text.Encoding.UTF8.GetBytes(password));
                return Convert.ToBase64String(bytes);
            }
        }
    }
}