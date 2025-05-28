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
    public class TagController : ControllerBase
    {
        private readonly AppDbContext _context;

        public TagController(AppDbContext context)
        {
            _context = context;
        }

        // GET: api/Tag
        [HttpGet]
        public async Task<ActionResult<IEnumerable<TagDto>>> GetTags()
        {
            var tags = await _context.Tags
                .Select(t => new TagDto
                {
                    Id = t.Id,
                    Name = t.Name
                })
                .ToListAsync();

            return Ok(tags);
        }

        // GET: api/Tag/5
        [HttpGet("{id}")]
        public async Task<ActionResult<TagDto>> GetTag(int id)
        {
            var tag = await _context.Tags
                .Include(t => t.PetTags)
                    .ThenInclude(pt => pt.Pet)
                .Where(t => t.Id == id)
                .Select(t => new TagDto
                {
                    Id = t.Id,
                    Name = t.Name,
                    Pets = t.PetTags.Select(pt => new PetShortDto
                    {
                        Id = pt.Pet.Id,
                        Name = pt.Pet.Name
                    }).ToList()
                })
                .FirstOrDefaultAsync();

            if (tag == null)
                return NotFound();

            return Ok(tag);
        }


        // PUT: api/Tag/5
        [HttpPut("{id}")]
        public async Task<IActionResult> PutTag(int id, [FromForm] TagDto dto)
        {
            if (dto.Id != null && dto.Id != id)
                return BadRequest("Mismatched ID");

            var tag = await _context.Tags
                .Include(t => t.PetTags)
                .FirstOrDefaultAsync(t => t.Id == id);

            if (tag == null)
                return NotFound();

            tag.Name = dto.Name;

            //usuwa stare powiązania
            _context.PetTags.RemoveRange(tag.PetTags);

            //dodaje nowe powiązania
            if (dto.PetIds != null && dto.PetIds.Any())
            {
                foreach (var petId in dto.PetIds)
                {
                    _context.PetTags.Add(new PetTag { PetId = petId, TagId = id });
                }
            }

            await _context.SaveChangesAsync();
            return NoContent();
        }


        // POST: api/Tag
        [HttpPost]
        public async Task<IActionResult> PostTag([FromForm] TagDto dto)
        {
            var newTag = new Tag
            {
                Name = dto.Name
            };

            _context.Tags.Add(newTag);
            await _context.SaveChangesAsync();

            if (dto.PetIds != null && dto.PetIds.Any())
            {
                foreach (var petId in dto.PetIds)
                {
                    _context.PetTags.Add(new PetTag { PetId = petId, TagId = newTag.Id });
                }
                await _context.SaveChangesAsync();
            }

            return CreatedAtAction(nameof(GetTag), new { id = newTag.Id }, null);
        }


        // DELETE: api/Tag/5
        [HttpDelete("{id}")]
        public async Task<IActionResult> DeleteTag(int id)
        {
            var tag = await _context.Tags.FindAsync(id);
            if (tag == null)
                return NotFound();

            _context.Tags.Remove(tag);
            await _context.SaveChangesAsync();

            return NoContent();
        }

        private bool TagExists(int id)
        {
            return _context.Tags.Any(e => e.Id == id);
        }
    }
}
