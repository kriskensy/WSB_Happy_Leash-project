using System.Security.Claims;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using WSB_Happy_Leash_project.Data.Context;
using WSB_Happy_Leash_project.Data.DTO;
using WSB_Happy_Leash_project.Data.Models;

namespace Backend.Controllers
{
    [Route("api/[controller]")]
    [ApiController]
    [Authorize(Roles = "Admin")]
    public class AdoptionRequestController : ControllerBase
    {
        private readonly AppDbContext _context;

        public AdoptionRequestController(AppDbContext context)
        {
            _context = context;
        }

        [HttpGet]
        public async Task<ActionResult<IEnumerable<AdoptionRequestDto>>> GetAdoptionRequests()
        {
            var requests = await _context.AdoptionRequests
                .Include(a => a.Pet)
                .Include(a => a.User)
                .Select(a => new AdoptionRequestDto
                {
                    Id = a.Id,
                    PetId = a.PetId,
                    UserId = a.UserId,
                    Message = a.Message,
                    RequestDate = a.RequestDate,
                    IsApproved = a.IsApproved,
                    PetName = a.Pet != null ? a.Pet.Name : null,
                    UserName = a.User != null ? a.User.FirstName + " " + a.User.LastName : null
                })
                .ToListAsync();

            return Ok(requests);
        }

        [HttpGet("{id}")]
        public async Task<ActionResult<AdoptionRequestDto>> GetAdoptionRequest(int id)
        {
            var request = await _context.AdoptionRequests
                .Include(a => a.Pet)
                .Include(a => a.User)
                .Where(a => a.Id == id)
                .Select(a => new AdoptionRequestDto
                {
                    Id = a.Id,
                    PetId = a.PetId,
                    UserId = a.UserId,
                    Message = a.Message,
                    RequestDate = a.RequestDate,
                    IsApproved = a.IsApproved,
                    PetName = a.Pet != null ? a.Pet.Name : null,
                    UserName = a.User != null ? a.User.FirstName + " " + a.User.LastName : null
                })
                .FirstOrDefaultAsync();

            if (request == null)
                return NotFound();

            return Ok(request);
        }

        [HttpPost]
        public async Task<ActionResult<AdoptionRequestDto>> PostAdoptionRequest([FromForm] AdoptionRequestDto dto)
        {
            if (!ModelState.IsValid)
                return BadRequest(ModelState);

            var userIdClaim = User.FindFirst("id");
            if (userIdClaim == null)
                return Unauthorized("User ID not found in token");

            if (!int.TryParse(userIdClaim.Value, out int userId))
                return Unauthorized("Invalid user ID in token");

            var adoptionRequest = new AdoptionRequest
            {
                PetId = dto.PetId,
                UserId = userId,
                Message = dto.Message,
                RequestDate = DateTime.UtcNow,
                IsApproved = false
            };

            _context.AdoptionRequests.Add(adoptionRequest);
            await _context.SaveChangesAsync();

            dto.Id = adoptionRequest.Id;
            dto.UserId = userId;

            return CreatedAtAction(nameof(GetAdoptionRequest), new { id = adoptionRequest.Id }, dto);
        }


        [HttpPut("{id}")]
        public async Task<IActionResult> PutAdoptionRequest(int id, AdoptionRequestDto dto)
        {
            if (id != dto.Id)
                return BadRequest("ID mismatch");

            var adoptionRequest = await _context.AdoptionRequests.FindAsync(id);
            if (adoptionRequest == null)
                return NotFound();

            adoptionRequest.PetId = dto.PetId;
            adoptionRequest.UserId = dto.UserId;
            adoptionRequest.Message = dto.Message;
            adoptionRequest.IsApproved = dto.IsApproved;

            await _context.SaveChangesAsync();
            return NoContent();
        }

        [HttpDelete("{id}")]
        public async Task<IActionResult> DeleteAdoptionRequest(int id)
        {
            var request = await _context.AdoptionRequests.FindAsync(id);
            if (request == null)
                return NotFound();

            _context.AdoptionRequests.Remove(request);
            await _context.SaveChangesAsync();

            return NoContent();
        }
    }
}
