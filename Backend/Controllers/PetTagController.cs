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
    public class PetTagController : ControllerBase
    {
        private readonly AppDbContext _context;

        public PetTagController(AppDbContext context)
        {
            _context = context;
        }

        // GET: api/PetTag
        [HttpGet]
        public async Task<ActionResult<IEnumerable<PetTagDto>>> GetPetTags()
        {
            var petTags = await _context.PetTags
                .Include(pt => pt.Pet)
                .Include(pt => pt.Tag)
                .Select(pt => new PetTagDto
                {
                    Id = pt.Id,
                    PetId = pt.PetId,
                    TagId = pt.TagId,
                    PetName = pt.Pet != null ? pt.Pet.Name : null,
                    TagName = pt.Tag != null ? pt.Tag.Name : null
                })
                .ToListAsync();

            return Ok(petTags);
        }

        // GET: api/PetTag/5
        [HttpGet("{id}")]
        public async Task<ActionResult<PetTagDto>> GetPetTag(int id)
        {
            var petTag = await _context.PetTags
                .Include(pt => pt.Pet)
                .Include(pt => pt.Tag)
                .Where(pt => pt.Id == id)
                .Select(pt => new PetTagDto
                {
                    Id = pt.Id,
                    PetId = pt.PetId,
                    TagId = pt.TagId,
                    PetName = pt.Pet != null ? pt.Pet.Name : null,
                    TagName = pt.Tag != null ? pt.Tag.Name : null
                })
                .FirstOrDefaultAsync();

            if (petTag == null)
                return NotFound();

            return Ok(petTag);
        }

        // POST: api/PetTag
        [HttpPost]
        public async Task<ActionResult> PostPetTag([FromBody] PetTagDto dto)
        {
            var petTag = new PetTag
            {
                PetId = dto.PetId,
                TagId = dto.TagId
            };

            _context.PetTags.Add(petTag);
            await _context.SaveChangesAsync();

            return CreatedAtAction(nameof(GetPetTag), new { id = petTag.Id }, null);
        }

        // PUT: api/PetTag/5
        [HttpPut("{id}")]
        public async Task<IActionResult> PutPetTag(int id, [FromBody] PetTagDto dto)
        {
            if (dto.Id != null && dto.Id != id)
                return BadRequest("Mismatched ID");

            var petTag = await _context.PetTags.FindAsync(id);
            if (petTag == null)
                return NotFound();

            petTag.PetId = dto.PetId;
            petTag.TagId = dto.TagId;

            await _context.SaveChangesAsync();
            return NoContent();
        }

        // DELETE: api/PetTag/5
        [HttpDelete("{id}")]
        public async Task<IActionResult> DeletePetTag(int id)
        {
            var petTag = await _context.PetTags.FindAsync(id);
            if (petTag == null)
                return NotFound();

            _context.PetTags.Remove(petTag);
            await _context.SaveChangesAsync();

            return NoContent();
        }

        private bool PetTagExists(int id)
        {
            return _context.PetTags.Any(e => e.Id == id);
        }
    }
}
