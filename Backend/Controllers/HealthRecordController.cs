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
    public class HealthRecordController : ControllerBase
    {
        private readonly AppDbContext _context;

        public HealthRecordController(AppDbContext context)
        {
            _context = context;
        }

        [HttpGet]
        public async Task<ActionResult<IEnumerable<HealthRecordDto>>> GetHealthRecords()
        {
            var records = await _context.HealthRecords
                .Include(r => r.Pet)
                .Select(r => new HealthRecordDto
                {
                    Id = r.Id,
                    PetId = r.PetId,
                    Description = r.Description,
                    RecordDate = r.RecordDate,
                    VetName = r.VetName,
                    PetName = r.Pet != null ? r.Pet.Name : null
                })
                .ToListAsync();

            return Ok(records);
        }

        [HttpGet("{id}")]
        public async Task<ActionResult<HealthRecordDto>> GetHealthRecord(int id)
        {
            var record = await _context.HealthRecords
                .Include(r => r.Pet)
                .Where(r => r.Id == id)
                .Select(r => new HealthRecordDto
                {
                    Id = r.Id,
                    PetId = r.PetId,
                    Description = r.Description,
                    RecordDate = r.RecordDate,
                    VetName = r.VetName,
                    PetName = r.Pet != null ? r.Pet.Name : null
                })
                .FirstOrDefaultAsync();

            if (record == null)
                return NotFound();

            return Ok(record);
        }

        [HttpPost]
        public async Task<ActionResult> PostHealthRecord([FromBody] HealthRecordDto dto)
        {

            var record = new HealthRecord
            {
                PetId = dto.PetId,
                Description = dto.Description,
                RecordDate = dto.RecordDate,
                VetName = dto.VetName
            };

            _context.HealthRecords.Add(record);
            await _context.SaveChangesAsync();

            return CreatedAtAction(nameof(GetHealthRecord), new { id = record.Id }, null);
        }

        [HttpPut("{id}")]
        public async Task<IActionResult> PutHealthRecord(int id, [FromBody] HealthRecordDto dto)
        {
            if (dto.Id != null && dto.Id != id)
                return BadRequest("Mismatched ID");

            var record = await _context.HealthRecords.FindAsync(id);
            if (record == null)
                return NotFound();

            record.PetId = dto.PetId;
            record.Description = dto.Description;
            record.RecordDate = dto.RecordDate;
            record.VetName = dto.VetName;

            await _context.SaveChangesAsync();
            return NoContent();
        }

        [HttpDelete("{id}")]
        public async Task<IActionResult> DeleteHealthRecord(int id)
        {
            var record = await _context.HealthRecords.FindAsync(id);
            if (record == null)
                return NotFound();

            _context.HealthRecords.Remove(record);
            await _context.SaveChangesAsync();
            return NoContent();
        }

        private bool HealthRecordExists(int id) =>
            _context.HealthRecords.Any(e => e.Id == id);
    }
}
