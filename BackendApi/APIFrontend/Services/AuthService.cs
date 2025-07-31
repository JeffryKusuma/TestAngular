using Microsoft.Extensions.Options;
using Microsoft.IdentityModel.Tokens;
using System.IdentityModel.Tokens.Jwt;
using System.Security.Claims;
using System.Text;
using APIFrontend.Models;
using APIFrontend.Data;
using Microsoft.EntityFrameworkCore;

namespace APIFrontend.Services
{
    public class AuthService : IAuthService
    {
        private readonly ApplicationDbContext _context;
        private readonly string _jwtSecret;

        public AuthService(ApplicationDbContext context, IOptions<JwtSetting> appSettings)
        {
            _context = context;
            _jwtSecret = appSettings.Value.JWT_Secret;
        }

        public async Task<User?> Register(RegisterRequest request)
        {
            if (await _context.Users.AnyAsync(u => u.Username == request.Username || u.Email == request.Email))
            {
                return null;
            }

            var user = new User
            {
                Username = request.Username,
                Email = request.Email,
                PasswordHash = BCrypt.Net.BCrypt.HashPassword(request.Password)
            };

            Role? role = null;
            if (!string.IsNullOrEmpty(request.RoleName))
            {
                role = await _context.Roles.SingleOrDefaultAsync(r => r.Name == request.RoleName);
            }

            if (role == null)
            {
                role = await _context.Roles.SingleOrDefaultAsync(r => r.Name == "User");
                if (role == null)
                {
                    role = new Role { Name = "User" };
                    _context.Roles.Add(role);
                    await _context.SaveChangesAsync();
                }
            }

            user.UserRoles.Add(new UserRole { Role = role });

            _context.Users.Add(user);
            await _context.SaveChangesAsync();
            return user;
        }

        public async Task<LoginRespond?> Login(LoginRequest request)
        {
            var user = await _context.Users.SingleOrDefaultAsync(u => u.Username == request.Username);

            if (user == null || !BCrypt.Net.BCrypt.Verify(request.Password, user.PasswordHash))
            {
                return null;
            }
            var cRespond = new LoginRespond();
            cRespond.username = request.Username;
            cRespond.id = user.Id;
            cRespond.email = user.Email;
            cRespond.token = GenerateJwtToken(user);
            return cRespond;
        }

        public string GenerateJwtToken(User user)
        {
            var tokenHandler = new JwtSecurityTokenHandler();
            var key = Encoding.ASCII.GetBytes(_jwtSecret);
            var claims = new List<Claim>
            {
                new Claim(ClaimTypes.NameIdentifier, user.Id.ToString()),
                new Claim(ClaimTypes.Name, user.Username),
                new Claim(ClaimTypes.Email, user.Email)
            };

            var tokenDescriptor = new SecurityTokenDescriptor
            {
                Subject = new ClaimsIdentity(claims),
                Expires = DateTime.UtcNow.AddHours(1),
                SigningCredentials = new SigningCredentials(new SymmetricSecurityKey(key), SecurityAlgorithms.HmacSha256Signature)
            };
            var token = tokenHandler.CreateToken(tokenDescriptor);
            return tokenHandler.WriteToken(token);
        }
    }
}