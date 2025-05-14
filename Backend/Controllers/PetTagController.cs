using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Http;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using WSB_Happy_Leash_project.Data.Context;
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
        public async Task<ActionResult<IEnumerable<PetTag>>> GetPetTags()
        {
            return await _context.PetTags.ToListAsync();
        }

        // GET: api/PetTag/5
        [HttpGet("{id}")]
        public async Task<ActionResult<PetTag>> GetPetTag(int id)
        {
            var petTag = await _context.PetTags.FindAsync(id);

            if (petTag == null)
            {
                return NotFound();
            }

            return petTag;
        }

        // PUT: api/PetTag/5
        // To protect from overposting attacks, see https://go.microsoft.com/fwlink/?linkid=2123754
        [HttpPut("{id}")]
        public async Task<IActionResult> PutPetTag(int id, PetTag petTag)
        {
            if (id != petTag.Id)
            {
                return BadRequest();
            }

            _context.Entry(petTag).State = EntityState.Modified;

            try
            {
                await _context.SaveChangesAsync();
            }
            catch (DbUpdateConcurrencyException)
            {
                if (!PetTagExists(id))
                {
                    return NotFound();
                }
                else
                {
                    throw;
                }
            }

            return NoContent();
        }

        // POST: api/PetTag
        // To protect from overposting attacks, see https://go.microsoft.com/fwlink/?linkid=2123754
        [HttpPost]
        public async Task<ActionResult<PetTag>> PostPetTag(PetTag petTag)
        {
            _context.PetTags.Add(petTag);
            await _context.SaveChangesAsync();

            return CreatedAtAction("GetPetTag", new { id = petTag.Id }, petTag);
        }

        // DELETE: api/PetTag/5
        [HttpDelete("{id}")]
        public async Task<IActionResult> DeletePetTag(int id)
        {
            var petTag = await _context.PetTags.FindAsync(id);
            if (petTag == null)
            {
                return NotFound();
            }

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
