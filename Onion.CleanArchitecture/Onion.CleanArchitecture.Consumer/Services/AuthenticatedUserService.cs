using Microsoft.AspNetCore.Http;
using Onion.CleanArchitecture.Application.Interfaces;
using System.Security.Claims;

namespace Onion.CleanArchitecture.Consumer.Services
{
    public class AuthenticatedUserService : IAuthenticatedUserService
    {
        public AuthenticatedUserService(IHttpContextAccessor httpContextAccessor)
        {
            UserId = httpContextAccessor.HttpContext?.User?.FindFirstValue("uid") ?? "";
            Email = httpContextAccessor.HttpContext?.User?.FindFirstValue("email") ?? "";
            MaNhanSu = httpContextAccessor.HttpContext?.User?.FindFirstValue("maNhanSu") ?? "";
        }
        public string UserId { get; }
        public string Email { get; }
        public string MaNhanSu { get; }
    }
}
