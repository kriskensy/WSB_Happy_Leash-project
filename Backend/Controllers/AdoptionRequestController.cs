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
    public class AdoptionRequestController : ControllerBase
    {
        private readonly AppDbContext _context;

        public AdoptionRequestController(AppDbContext context)
        {
            _context = context;
        }

        // GET: api/AdoptionRequest
        [HttpGet]
        public async Task<ActionResult<IEnumerable<AdoptionRequest>>> GetAdoptionRequests()
        {
            return await _context.AdoptionRequests.ToListAsync();
        }

        // GET: api/AdoptionRequest/5
        [HttpGet("{id}")]
        public async Task<ActionResult<AdoptionRequest>> GetAdoptionRequest(int id)
        {
            var adoptionRequest = await _context.AdoptionRequests.FindAsync(id);

            if (adoptionRequest == null)
            {
                return NotFound();
            }

            return adoptionRequest;
        }

        // PUT: api/AdoptionRequest/5
        // To protect from overposting attacks, see https://go.microsoft.com/fwlink/?linkid=2123754
        [HttpPut("{id}")]
        public async Task<IActionResult> PutAdoptionRequest(int id, AdoptionRequest adoptionRequest)
        {
            if (id != adoptionRequest.Id)
            {
                return BadRequest();
            }

            _context.Entry(adoptionRequest).State = EntityState.Modified;

            try
            {
                await _context.SaveChangesAsync();
            }
            catch (DbUpdateConcurrencyException)
            {
                if (!AdoptionRequestExists(id))
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

        // POST: api/AdoptionRequest
        // To protect from overposting attacks, see https://go.microsoft.com/fwlink/?linkid=2123754
        [HttpPost]
        public async Task<ActionResult<AdoptionRequest>> PostAdoptionRequest(AdoptionRequest adoptionRequest)
        {
            _context.AdoptionRequests.Add(adoptionRequest);
            await _context.SaveChangesAsync();

            return CreatedAtAction("GetAdoptionRequest", new { id = adoptionRequest.Id }, adoptionRequest);
        }

        // DELETE: api/AdoptionRequest/5
        [HttpDelete("{id}")]
        public async Task<IActionResult> DeleteAdoptionRequest(int id)
        {
            var adoptionRequest = await _context.AdoptionRequests.FindAsync(id);
            if (adoptionRequest == null)
            {
                return NotFound();
            }

            _context.AdoptionRequests.Remove(adoptionRequest);
            await _context.SaveChangesAsync();

            return NoContent();
        }

        private bool AdoptionRequestExists(int id)
        {
            return _context.AdoptionRequests.Any(e => e.Id == id);
        }
    }
}
