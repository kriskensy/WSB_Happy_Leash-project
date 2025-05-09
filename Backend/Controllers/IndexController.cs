using Microsoft.AspNetCore.Mvc;

namespace Backend.Controllers
{
    [Route("api/index")] 
    [ApiController]
    public class IndexController : ControllerBase
    {
        [HttpGet]
        public IActionResult Get()
        {
            return Ok(new { message = "Wiadomość z backendu" });
        }
    }
}