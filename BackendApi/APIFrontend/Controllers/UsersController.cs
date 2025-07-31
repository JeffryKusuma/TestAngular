using APIFrontend.Data;
using APIFrontend.Models;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using System.Security.Claims;

namespace APIFrontend.Controllers
{
    [Authorize] 
    [Route("api/[controller]")]
    [ApiController]
    public class UsersController : ControllerBase
    {
        private readonly ApplicationDbContext _context;

        public UsersController(ApplicationDbContext context)
        {
            _context = context;
        }
        [HttpGet]
        [Authorize(Roles = "Admin")] 
        public async Task<IActionResult> GetUsers()
        {
            var users = await _context.Users
                                      .Include(u => u.UserRoles)
                                          .ThenInclude(ur => ur.Role)
                                      .ToListAsync();

            var userDtos = users.Select(u => new
            {
                u.Id,
                u.Username,
                u.Email,
                Roles = u.UserRoles.Select(ur => ur.Role.Name).ToList() 
            });

            return Ok(userDtos);
        }

        [HttpGet("me")]
        public IActionResult GetCurrentUser()
        {
           
            var userId = User.FindFirst(ClaimTypes.NameIdentifier)?.Value;
            var username = User.FindFirst(ClaimTypes.Name)?.Value;
            var email = User.FindFirst(ClaimTypes.Email)?.Value;
            var roles = User.FindAll(ClaimTypes.Role).Select(c => c.Value).ToList(); 

            if (userId == null)
            {
                return Unauthorized(); 
            }

            return Ok(new { Id = userId, Username = username, Email = email, Roles = roles });
        }

        [HttpGet("{id}")]
        [Authorize(Roles = "Admin,User")] 
        public async Task<IActionResult> GetUserById(int id)
        {
            var user = await _context.Users
                                     .Include(u => u.UserRoles)
                                         .ThenInclude(ur => ur.Role)
                                     .FirstOrDefaultAsync(u => u.Id == id);

            if (user == null)
            {
                return NotFound();
            }

            return Ok(new
            {
                user.Id,
                user.Username,
                user.Email,
                Roles = user.UserRoles.Select(ur => ur.Role.Name).ToList()
            });
        }

        [HttpPut("{id}")]
        [Authorize(Roles = "Admin")] // Only Admin can update users
        public async Task<IActionResult> UpdateUser(int id, [FromBody] User updatedUser)
        {
            if (id != updatedUser.Id)
            {
                return BadRequest("User ID mismatch.");
            }

            var existingUser = await _context.Users.FindAsync(id);
            if (existingUser == null)
            {
                return NotFound();
            }

            // Only allow updating certain fields, e.g., email.
            // Password updates should go through a separate, more secure process.
            existingUser.Email = updatedUser.Email;

            // If you want to allow updating roles, you'd need more complex logic here
            // involving fetching existing roles and adding/removing UserRole entries.

            _context.Users.Update(existingUser);
            await _context.SaveChangesAsync();

            return NoContent(); 
        }

        [HttpDelete("{id}")]
        [Authorize(Roles = "Admin")] 
        public async Task<IActionResult> DeleteUser(int id)
        {
            var user = await _context.Users.FindAsync(id);
            if (user == null)
            {
                return NotFound();
            }

            _context.Users.Remove(user);
            await _context.SaveChangesAsync();

            return NoContent();
        }
    }
}