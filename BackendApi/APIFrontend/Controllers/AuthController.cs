using APIFrontend.Models;
using APIFrontend.Services;
using Microsoft.AspNetCore.Mvc;

namespace APIFrontend.Controllers
{
    [Route("api/[controller]")]
    [ApiController]
    public class AuthController : ControllerBase
    {
        private readonly IAuthService _authService;

        public AuthController(IAuthService authService)
        {
            _authService = authService;
        }

        [HttpPost("register")]
        public async Task<IActionResult> Register([FromBody] RegisterRequest request)
        {
            if (!ModelState.IsValid)
            {
                return BadRequest(ModelState);
            }

            var user = await _authService.Register(request);
            if (user == null)
            {
                return BadRequest(new { message = "Username or Email already exists." });
            }

            return Ok(new { message = "Registration successful!", userId = user.Id });
        }

        [HttpPost("login")]
        public async Task<IActionResult> Login([FromBody] LoginRequest request)
        {
            if (!ModelState.IsValid)
            {
                return BadRequest(ModelState);
            }

            var token = await _authService.Login(request);
            if (token == null)
            {
                return Unauthorized(new { message = "Invalid username or password." });
            }

            return Ok(token);
        }
    }
}