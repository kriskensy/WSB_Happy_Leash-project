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
        [HttpGet("test")]
        public IActionResult Test()
        {
            return Ok("Test działa");
        }
        [HttpGet("redirect")]
        public IActionResult Index()
        {
            return Redirect("http://localhost:3000");
        }
    }
}