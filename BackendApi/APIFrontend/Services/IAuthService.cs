using APIFrontend.Models;

namespace APIFrontend.Services
{
    public interface IAuthService
    {
        Task<User?> Register(RegisterRequest request);
        Task<LoginRespond?> Login(LoginRequest request);
        string GenerateJwtToken(User user);
    }
}