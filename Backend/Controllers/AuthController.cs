using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using WSB_Happy_Leash_project.Data.Context;
using WSB_Happy_Leash_project.Data.DTO;
using WSB_Happy_Leash_project.Data.Models;
using Backend.Services;
using System.Security.Cryptography;
using WSB_Happy_Leash_project.Backend.Interfaces;

namespace Backend.Controllers
{
    [Route("api/auth")]
    [ApiController]
    public class AuthController : ControllerBase
    {
        private readonly AppDbContext _context;
        private readonly JwtService _jwtService;
        private readonly IEmailSender _emailSender;

        private const string FileType = "img/png";


        public AuthController(AppDbContext context, JwtService jwtService, IEmailSender emailSender)
        {
            _context = context;
            _jwtService = jwtService;
            _emailSender = emailSender;
        }

        [HttpPost("login")]
        public async Task<IActionResult> Login([FromForm] string login, [FromForm] string password)
        {
            if (string.IsNullOrEmpty(login) || string.IsNullOrEmpty(password))
                return BadRequest(new { message = "Login and password are required" });

            var user = await _context.Users.FirstOrDefaultAsync(x => x.Login == login && x.PasswordHash == HashPassword(password));
            if (user == null)
                return NotFound(new { message = "User not found" });

            return Ok(new
            {
                message = "Login successful",
                userToken = _jwtService.GenerateToken(user),
            });
        }

        [HttpGet("users")]
        public async Task<ActionResult<IEnumerable<UserDto>>> GetUsers()
        {
            var users = await _context.Users.ToListAsync();
            return users.Select(u => ToDto(u)).ToList();
        }

        [HttpPost("register")]
        public async Task<IActionResult> Register([FromForm] UserDto dto)
        {
            if (string.IsNullOrWhiteSpace(dto.Login) ||
                string.IsNullOrWhiteSpace(dto.Password) ||
                string.IsNullOrWhiteSpace(dto.FirstName) ||
                string.IsNullOrWhiteSpace(dto.LastName) ||
                string.IsNullOrWhiteSpace(dto.Email))
            {
                return BadRequest(new { message = "All required fields must be provided" });
            }

            var existingUser = await _context.Users.FirstOrDefaultAsync(x => x.Login == dto.Login || x.Email == dto.Email);
            if (existingUser != null)
                return Conflict(new { message = "User with this login or email already exists" });

            var newUser = new User
            {
                Login = dto.Login,
                PasswordHash = HashPassword(dto.Password!),
                FirstName = dto.FirstName,
                LastName = dto.LastName,
                Email = dto.Email,
                PhoneNumber = dto.PhoneNumber,
                Address = dto.Address,
                City = dto.City,
                PostalCode = dto.PostalCode,
                Country = dto.Country,
                ProfilePictureURL = dto.ProfilePictureURL,
                CreatedAt = DateTime.UtcNow,
                UserType = UserType.User
            };

            _context.Users.Add(newUser);
            await _context.SaveChangesAsync();
            SendEmail(newUser.Email, newUser.FirstName, newUser.LastName);

            return CreatedAtAction(nameof(GetUser), new { id = newUser.Id }, new { message = "User created successfully" });
        }
        [HttpPost("create")]
        public async Task<IActionResult> Create([FromForm] UserDto dto, IFormFile? Picture)
        {
            if (string.IsNullOrWhiteSpace(dto.Login) ||
                string.IsNullOrWhiteSpace(dto.Password) ||
                string.IsNullOrWhiteSpace(dto.FirstName) ||
                string.IsNullOrWhiteSpace(dto.LastName) ||
                string.IsNullOrWhiteSpace(dto.Email))
            {
                return BadRequest(new { message = "All required fields must be provided" });
            }

            var existingUser = await _context.Users.FirstOrDefaultAsync(x => x.Login == dto.Login || x.Email == dto.Email);
            if (existingUser != null)
                return Conflict(new { message = "User with this login or email already exists" });

            var newUser = new User
            {
                Login = dto.Login,
                PasswordHash = HashPassword(dto.Password!),
                FirstName = dto.FirstName,
                LastName = dto.LastName,
                Email = dto.Email,
                PhoneNumber = dto.PhoneNumber,
                Address = dto.Address,
                City = dto.City,
                PostalCode = dto.PostalCode,
                Country = dto.Country,
                CreatedAt = DateTime.UtcNow,
                UserType = dto.UserType ?? UserType.User,
            };

            if (Picture != null && Picture.Length > 0)
            {
                var fileName = Guid.NewGuid() + Path.GetExtension(Picture.FileName);
                var path = Path.Combine(Directory.GetCurrentDirectory(), "wwwroot/uploads");
                Directory.CreateDirectory(path);
                var filePath = Path.Combine(path, fileName);
                using var stream = new FileStream(filePath, FileMode.Create);
                await Picture.CopyToAsync(stream);
                newUser.ProfilePictureURL = $"/uploads/{fileName}";
            }

            _context.Users.Add(newUser);
            await _context.SaveChangesAsync();
            SendEmail(newUser.Email, newUser.FirstName, newUser.LastName);

            return CreatedAtAction(nameof(GetUser), new { id = newUser.Id }, new { message = "User created succesfully!" });
        }

        [HttpGet("user/{id}")]
        public async Task<ActionResult<UserDto>> GetUser(int id)
        {
            var user = await _context.Users.FirstOrDefaultAsync(u => u.Id == id);
            if (user == null)
                return NotFound(new { message = "User not found" });

            return ToDto(user);
        }

        [HttpPut("edit/{id}")]
        public async Task<IActionResult> Edit([FromForm] int id, [FromForm] UserDto dto, IFormFile? Picture)
        {
            if (string.IsNullOrWhiteSpace(dto.Login) ||
                string.IsNullOrWhiteSpace(dto.FirstName) ||
                string.IsNullOrWhiteSpace(dto.LastName) ||
                string.IsNullOrWhiteSpace(dto.Email))
            {
                return BadRequest(new { message = "All required fields must be provided" });
            }

            var user = await _context.Users.FirstOrDefaultAsync(x => x.Id == id);
            if (user == null)
                return NotFound(new { message = "User with id " + id + " not found" });

            var duplicate = await _context.Users.FirstOrDefaultAsync(x =>
                (x.Login == dto.Login || x.Email == dto.Email) && x.Id != id);
            if (duplicate != null)
                return Conflict(new { message = "Another user with this login or email already exists" });

            user.Login = dto.Login;
            user.FirstName = dto.FirstName;
            user.LastName = dto.LastName;
            user.Email = dto.Email;
            user.PhoneNumber = dto.PhoneNumber;
            user.Address = dto.Address;
            user.City = dto.City;
            user.PostalCode = dto.PostalCode;
            user.Country = dto.Country;

            if (Picture != null && Picture.Length > 0)
            {
                if (!string.IsNullOrEmpty(user.ProfilePictureURL))
                {
                    var oldPath = Path.Combine(Directory.GetCurrentDirectory(), "wwwroot", user.ProfilePictureURL.TrimStart('/'));
                    if (System.IO.File.Exists(oldPath))
                    {
                        System.IO.File.Delete(oldPath);
                    }
                }

                var fileName = Guid.NewGuid() + Path.GetExtension(Picture.FileName);
                var path = Path.Combine(Directory.GetCurrentDirectory(), "wwwroot/uploads");
                Directory.CreateDirectory(path);
                var filePath = Path.Combine(path, fileName);

                using var stream = new FileStream(filePath, FileMode.Create);
                await Picture.CopyToAsync(stream);

                user.ProfilePictureURL = $"/uploads/{fileName}";
            }
            await _context.SaveChangesAsync();
            return Ok(new { message = "User updated successfully" });
        }


        [HttpDelete("delete/{id}")]
        public async Task<IActionResult> Delete(int id)
        {
            var user = await _context.Users.FindAsync(id);
            if (user == null)
                return NotFound(new { message = "User not found" });

            if (!string.IsNullOrEmpty(user.ProfilePictureURL))
            {
                var picturePath = Path.Combine(Directory.GetCurrentDirectory(), "wwwroot", user.ProfilePictureURL.TrimStart('/'));
                if (System.IO.File.Exists(picturePath))
                {
                    System.IO.File.Delete(picturePath);
                }
            }

            _context.Users.Remove(user);
            await _context.SaveChangesAsync();

            return Ok(new { message = "User deleted successfully" });
        }

        private UserDto ToDto(User user)
        {
            var dto = new UserDto
            {
                Id = user.Id,
                FirstName = user.FirstName,
                LastName = user.LastName,
                Login = user.Login,
                Email = user.Email,
                PhoneNumber = user.PhoneNumber,
                Address = user.Address,
                City = user.City,
                PostalCode = user.PostalCode,
                Country = user.Country,
                ProfilePictureURL = user.ProfilePictureURL,
                CreatedAt = user.CreatedAt,
                UserType = user.UserType
            };


            return dto;
        }

        private string HashPassword(string password)
        {
            using var sha256 = SHA256.Create();
            var bytes = sha256.ComputeHash(System.Text.Encoding.UTF8.GetBytes(password));
            return Convert.ToBase64String(bytes);
        }

        private void SendEmail(string to, string userName, string userSurname)
        {
            var message = new Message(new string[] { to }, "Welcome to Happy Leash " + userName + " " + userSurname, $"Thank you for registering with Happy Leash!\n\n" +
                "We are excited to have you on board. If you have any questions or need assistance, feel free to reach out to us.\n\n" +
                "Best regards,\nHappy Leash Team");
            _emailSender.SendEmailAsync(message);
        }

    }
}
