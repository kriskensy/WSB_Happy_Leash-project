using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Http;
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
    public class BreedController : ControllerBase
    {
        private readonly AppDbContext _context;

        public BreedController(AppDbContext context)
        {
            _context = context;
        }

        // GET: api/Breed
        [HttpGet]
        public async Task<ActionResult<IEnumerable<BreedDto>>> GetBreeds()
        {
            var breeds = await _context.Breeds
                .Include(b => b.PetType)
                .Select(b => new BreedDto
                {
                    Id = b.Id,
                    Name = b.Name,
                    PetTypeId = b.PetTypeId, //TODO dodane mapowanie pola
                    PetTypeName = b.PetType != null ? b.PetType.Name : "Unknown"
                })
                .ToListAsync();

            return breeds;
        }

        // // GET: api/Breed/5
        // [HttpGet("{id}")]
        // public async Task<ActionResult<Breed>> GetBreed(int id)
        // {
        //     var breed = await _context.Breeds.FindAsync(id);

        //     if (breed == null)
        //     {
        //         return NotFound();
        //     }

        //     return breed;
        // }

        //TODO dodane poprawne mapowanie do dto
        [HttpGet("{id}")]
        public async Task<ActionResult<BreedDto>> GetBreed(int id)
        {
            var breed = await _context.Breeds
                .Include(b => b.PetType) // pobierz powiązany typ zwierzaka
                .Where(b => b.Id == id)
                .Select(b => new BreedDto
                {
                    Id = b.Id,
                    Name = b.Name,
                    PetTypeId = b.PetTypeId, //TODO dodane mapowanie pola
                    PetTypeName = b.PetType != null ? b.PetType.Name : "Unknown",
                })
                .FirstOrDefaultAsync();

            if (breed == null)
            {
                return NotFound();
            }

            return breed;
        }

        // PUT: api/Breed/5
        // To protect from overposting attacks, see https://go.microsoft.com/fwlink/?linkid=2123754
        [HttpPut("{id}")]
        public async Task<IActionResult> PutBreed(int id, Breed breed)
        {
            if (id != breed.Id)
            {
                return BadRequest();
            }

            _context.Entry(breed).State = EntityState.Modified;

            try
            {
                await _context.SaveChangesAsync();
            }
            catch (DbUpdateConcurrencyException)
            {
                if (!BreedExists(id))
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

        // POST: api/Breed
        // To protect from overposting attacks, see https://go.microsoft.com/fwlink/?linkid=2123754
        [HttpPost]
        public async Task<ActionResult<Breed>> PostBreed(Breed breed)
        {
            _context.Breeds.Add(breed);
            await _context.SaveChangesAsync();

            return CreatedAtAction("GetBreed", new { id = breed.Id }, breed);
        }

        // DELETE: api/Breed/5
        [HttpDelete("{id}")]
        public async Task<IActionResult> DeleteBreed(int id)
        {
            var breed = await _context.Breeds.FindAsync(id);
            if (breed == null)
            {
                return NotFound();
            }

            _context.Breeds.Remove(breed);
            await _context.SaveChangesAsync();

            return NoContent();
        }

        private bool BreedExists(int id)
        {
            return _context.Breeds.Any(e => e.Id == id);
        }
    }
}
