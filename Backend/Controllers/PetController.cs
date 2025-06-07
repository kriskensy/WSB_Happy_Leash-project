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
    public class PetController : ControllerBase
    {
        private readonly AppDbContext _context;

        public PetController(AppDbContext context)
        {
            _context = context;
        }

        // GET: api/Pet
        [HttpGet]
        public async Task<ActionResult<IEnumerable<PetDto>>> GetPets()
        {
            var pets = await _context.Pets
                .Include(p => p.Breed)
                .ThenInclude(b => b.PetType)
                .Select(p => new PetDto
                {
                    Id = p.Id,
                    Name = p.Name,
                    Age = p.Age,
                    Weight = p.Weight,
                    Gender = p.Gender,
                    Notes = p.Notes,
                    PictureURL = p.PictureURL,
                    BreedId = p.BreedId,
                    BreedName = p.Breed != null ? p.Breed.Name : string.Empty,
                    PetTypeName = p.Breed != null && p.Breed.PetType != null ? p.Breed.PetType.Name : string.Empty
                })
                .ToListAsync();

            return Ok(pets);
        }

        // GET: api/Pet/5
        [AllowAnonymous]
        [HttpGet("{id}")]
        public async Task<ActionResult<PetDto>> GetPet(int id)
        {
            var pet = await _context.Pets
                .Include(p => p.Breed)
                .ThenInclude(b => b.PetType)
                .Where(p => p.Id == id)
                .Select(p => new PetDto
                {
                    Id = p.Id,
                    Name = p.Name,
                    Age = p.Age,
                    Weight = p.Weight,
                    Gender = p.Gender,
                    GenderName = p.Gender.ToString(), //TODO dodane mapowanie
                    Notes = p.Notes,
                    PictureURL = p.PictureURL,
                    BreedId = p.BreedId,
                    BreedName = p.Breed != null ? p.Breed.Name : string.Empty,
                    PetTypeName = p.Breed != null && p.Breed.PetType != null ? p.Breed.PetType.Name : string.Empty,
                    Tags = p.PetTags.Select(pt => new TagDto //TODO mapowanie tagów
                    {
                        Id = pt.Tag.Id,
                        Name = pt.Tag.Name
                    }).ToList(),
                    Adopted = _context.AdoptionRequests.Any(ar => ar.PetId == p.Id && ar.IsApproved)
                })
                .FirstOrDefaultAsync();

            if (pet == null)
                return NotFound();

            return Ok(pet);
        }

        // GET: /api/Pet/type/{typeId}
        [HttpGet("type/{typeId}")]
        [AllowAnonymous]
        public async Task<ActionResult<IEnumerable<PetDto>>> GetPetsByType(int typeId, [FromQuery] bool? adopted = null)
        {
            var petsQuery = _context.Pets
                .Include(p => p.Breed)
                .ThenInclude(b => b.PetType)
                .Where(p => p.Breed != null && p.Breed.PetTypeId == typeId);

            //TODO tu dodane filtrowanie po braku zaakceptowanych wniosków adopcyjnych
            if (adopted.HasValue)
            {
                if (adopted == false)
                {
                    petsQuery = petsQuery.Where(p => !_context.AdoptionRequests.Any(ar => ar.PetId == p.Id && ar.IsApproved)); //tylko te BEZ potwierdzonej adopcji
                }
                if (adopted.Value == true)
                {
                    petsQuery = petsQuery.Where(p => _context.AdoptionRequests.Any(ar => ar.PetId == p.Id && ar.IsApproved)); //tylko te Z potwierdzoną adopcją
                }
            }

                var pets = await petsQuery
                .Select(p => new PetDto
                {
                    Id = p.Id,
                    Name = p.Name,
                    Age = p.Age,
                    Weight = p.Weight,
                    Gender = p.Gender,
                    GenderName = p.Gender.ToString(),
                    Notes = p.Notes,
                    PictureURL = p.PictureURL,
                    BreedId = p.BreedId,
                    BreedName = p.Breed != null ? p.Breed.Name : string.Empty,
                    PetTypeName = p.Breed != null && p.Breed.PetType != null ? p.Breed.PetType.Name : string.Empty,
                    Tags = p.PetTags.Select(pt => new TagDto
                    {
                        Id = pt.Tag.Id,
                        Name = pt.Tag.Name
                    }).ToList()
                })
                .ToListAsync();

            return Ok(pets);
        }

        // POST: api/Pet
        [HttpPost]
        public async Task<ActionResult> PostPet([FromForm] PetDto dto, IFormFile? Picture)
        {
            var pet = new Pet
            {
                Name = dto.Name,
                Age = dto.Age,
                Weight = dto.Weight,
                Gender = dto.Gender,
                Notes = dto.Notes,
                BreedId = dto.BreedId,
                PictureURL = string.Empty
            };

            if (Picture != null && Picture.Length > 0)
            {
                var fileName = Guid.NewGuid() + Path.GetExtension(Picture.FileName);
                var path = Path.Combine(Directory.GetCurrentDirectory(), "wwwroot/uploads");
                Directory.CreateDirectory(path);
                var filePath = Path.Combine(path, fileName);
                using var stream = new FileStream(filePath, FileMode.Create);
                await Picture.CopyToAsync(stream);
                pet.PictureURL = $"/uploads/{fileName}";
            }

            _context.Pets.Add(pet);
            await _context.SaveChangesAsync();

            //TODO dodane powiązania z tagami
            if (dto.TagIds != null && dto.TagIds.Any())
            {
                foreach (var tagId in dto.TagIds)
                {
                    _context.PetTags.Add(new PetTag { PetId = pet.Id, TagId = tagId });
                }
                await _context.SaveChangesAsync();
            }

            return CreatedAtAction(nameof(GetPet), new { id = pet.Id }, null);
        }

        // PUT: api/Pet/5
        [HttpPut("{id}")]
        public async Task<IActionResult> PutPet(int id, [FromForm] PetDto dto, IFormFile? Picture)
        {
            if (dto.Id != null && id != dto.Id)
                return BadRequest("Mismatched ID");

            var pet = await _context.Pets
                .Include(p => p.PetTags)
                .FirstOrDefaultAsync(p => p.Id == id);


            if (pet == null)
                return NotFound();

            pet.Name = dto.Name;
            pet.Age = dto.Age;
            pet.Weight = dto.Weight;
            pet.Gender = dto.Gender;
            pet.Notes = dto.Notes;
            pet.BreedId = dto.BreedId;

            if (Picture != null && Picture.Length > 0)
            {
                var fileName = Guid.NewGuid() + Path.GetExtension(Picture.FileName);
                var path = Path.Combine(Directory.GetCurrentDirectory(), "wwwroot/uploads");
                Directory.CreateDirectory(path);
                var filePath = Path.Combine(path, fileName);
                using var stream = new FileStream(filePath, FileMode.Create);
                await Picture.CopyToAsync(stream);
                pet.PictureURL = $"/uploads/{fileName}";
            }

            //TODO usunięcie starego powiązania tagów i dodanie nowego
            var existingTags = _context.PetTags.Where(pt => pt.PetId == id);
            _context.PetTags.RemoveRange(existingTags);

            //nowe powiązanie
            if (dto.TagIds != null && dto.TagIds.Any())
            {
                foreach (var tagId in dto.TagIds)
                {
                    _context.PetTags.Add(new PetTag { PetId = id, TagId = tagId });
                }
            }


            await _context.SaveChangesAsync();
            return NoContent();
        }

        // DELETE: api/Pet/5
        [HttpDelete("{id}")]
        public async Task<IActionResult> DeletePet(int id)
        {
            var pet = await _context.Pets.FindAsync(id);
            if (pet == null)
                return NotFound();

            _context.Pets.Remove(pet);
            await _context.SaveChangesAsync();
            return NoContent();
        }

        private bool PetExists(int id) =>
            _context.Pets.Any(p => p.Id == id);
    }
}
