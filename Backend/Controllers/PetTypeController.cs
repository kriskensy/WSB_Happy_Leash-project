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
    public class PetTypeController : ControllerBase
    {
        private readonly AppDbContext _context;

        public PetTypeController(AppDbContext context)
        {
            _context = context;
        }

        // GET: api/PetType
        [HttpGet]
        public async Task<ActionResult<IEnumerable<PetTypeDto>>> GetPetTypes()
        {
            var types = await _context.PetTypes
                .Select(pt => new PetTypeDto
                {
                    Id = pt.Id,
                    Name = pt.Name
                })
                .ToListAsync();

            return Ok(types);
        }

        // GET: api/PetType/5
        [HttpGet("{id}")]
        public async Task<ActionResult<PetTypeDto>> GetPetType(int id)
        {
            var pt = await _context.PetTypes.FindAsync(id);
            if (pt == null)
                return NotFound();

            var dto = new PetTypeDto
            {
                Id = pt.Id,
                Name = pt.Name
            };

            return Ok(dto);
        }

        // PUT: api/PetType/5
        [HttpPut("{id}")]
        public async Task<IActionResult> PutPetType(int id, [FromBody] PetTypeDto dto)
        {
            if (dto.Id != null && dto.Id != id)
                return BadRequest("Mismatched ID");

            var pt = await _context.PetTypes.FindAsync(id);
            if (pt == null)
                return NotFound();

            pt.Name = dto.Name;
            await _context.SaveChangesAsync();

            return NoContent();
        }

        // POST: api/PetType
        [HttpPost]
        public async Task<IActionResult> PostPetType([FromBody] PetTypeDto dto)
        {
            var newPt = new PetType
            {
                Name = dto.Name
            };

            _context.PetTypes.Add(newPt);
            await _context.SaveChangesAsync();

            return CreatedAtAction(nameof(GetPetType), new { id = newPt.Id }, null);
        }

        // DELETE: api/PetType/5
        [HttpDelete("{id}")]
        public async Task<IActionResult> DeletePetType(int id)
        {
            var pt = await _context.PetTypes.FindAsync(id);
            if (pt == null)
                return NotFound();

            _context.PetTypes.Remove(pt);
            await _context.SaveChangesAsync();

            return NoContent();
        }

        private bool PetTypeExists(int id)
        {
            return _context.PetTypes.Any(e => e.Id == id);
        }
    }
}
