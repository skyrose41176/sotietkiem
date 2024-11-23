using Onion.CleanArchitecture.Application.DTOs.Account;
using Onion.CleanArchitecture.Application.Wrappers;
using System.Threading.Tasks;

namespace Onion.CleanArchitecture.Application.Interfaces
{
    public interface IAccountService
    {
        Task<Response<AuthenticationResponse>> AuthenticateAsync(AuthenticationRequest request, string ipAddress);
        Task<Response<AuthenticationResponse>> AuthenticateAsync1(AuthenticationRequest request, string ipAddress);
        Task<Response<AuthenticationResponse>> AuthenticateAsync2(AuthenticationRequest request, string ipAddress);
        Task<Response<AuthenticationResponse>> AuthenWithoutPasswordAsync(string email, string ipAddress);
        Task<Response<string>> RegisterAsync(RegisterRequest request, string origin);
        Task<Response<string>> ConfirmEmailAsync(string userId, string code);
        Task ForgotPassword(ForgotPasswordRequest model, string origin);
        Task<Response<string>> ResetPassword(ResetPasswordRequest model);
    }
}
