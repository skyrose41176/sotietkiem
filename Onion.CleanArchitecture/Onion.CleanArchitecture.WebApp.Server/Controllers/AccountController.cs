using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using Microsoft.Extensions.Options;
using Onion.CleanArchitecture.Application.DTOs.Account;
using Onion.CleanArchitecture.Application.Exceptions;
using Onion.CleanArchitecture.Application.Helpers;
using Onion.CleanArchitecture.Application.Interfaces;
using Onion.CleanArchitecture.Application.Interfaces.Repositories;
using Onion.CleanArchitecture.Infrastructure.Identity.Features.Users.Queries.GetMeByToken;
using System.Security.Claims;

namespace Onion.CleanArchitecture.WebApp.Server.Controllers
{
    [Route("api/account")]
    [ApiController]
    public class AccountController : BaseApiController
    {
        private readonly IAccountService _accountService;
        private readonly IPolicyRepository _PolicyRepository;
        private readonly ILdapAuthenHelper _ldap;

        private readonly LdapConfig _ldapConfig;
        [Obsolete]
        public AccountController(IOptions<LdapConfig> ldapConfig, ILdapAuthenHelper ldap, IAccountService accountService, IPolicyRepository PolicyRepository) : base(PolicyRepository)
        {
            _accountService = accountService;
            _PolicyRepository = PolicyRepository;
            _ldap = ldap;
            _ldapConfig = ldapConfig.Value;
        }
        [HttpPost("authenticate")] // authen cũ
        public async Task<IActionResult> AuthenticateAsync(AuthenticationRequest request)
        {
            return Ok(await _accountService.AuthenticateAsync(request, GenerateIPAddress()));
        }

        [HttpPost("authenticate-1")] // authen trả ra token { action:"list", resource:["role","product"]} 
        public async Task<IActionResult> AuthenticateAsync1(AuthenticationRequest request)
        {
            return Ok(await _accountService.AuthenticateAsync1(request, GenerateIPAddress()));
        }

        [HttpPost("authenticate-2")] // authen token k gen permission trả ra riêng một field permission trong response
        public async Task<IActionResult> AuthenticateAsync2(AuthenticationRequest request)
        {
            return Ok(await _accountService.AuthenticateAsync2(request, GenerateIPAddress()));
        }
        
        [HttpPost("authenticate-ad")]
        public async Task<IActionResult> AuthenticateLdappAsync([FromBody] LdapAuthen request)
        {
            var info = _ldap.AuthenInfoMail(request.userAd, _ldapConfig);
            if (info is null) throw new ApiException($"Không tìm thấy nhân sự với ad {request.userAd}");

            return Ok(await _accountService.AuthenticateAsync(new AuthenticationRequest() { Email = info.EmailAddress }, GenerateIPAddress()));
        }
        
        [HttpPost("authen")]
        public async Task<IActionResult> AuthenWithoutPasswordAsync(AuthenticationRequest request)
        {
            return Ok(await _accountService.AuthenWithoutPasswordAsync(request.Email, GenerateIPAddress()));
        }

        [Authorize]
        [HttpGet("me")]
        public async Task<IActionResult> GetCurrentUserAsync()
        {

            if (HttpContext.User.Identity is ClaimsIdentity identity)
            {
                return Ok(await Mediator.Send(new GetMeByTokenQuery { Identity = identity }));
            }
            else
            {
                throw new ApiException("User not found", 404);
            }

        }
        [HttpPost("register")]
        public async Task<IActionResult> RegisterAsync(RegisterRequest request)
        {
            var origin = Request.Headers["origin"];
            return Ok(await _accountService.RegisterAsync(request, origin));
        }
        [HttpGet("confirm-email")]
        public async Task<IActionResult> ConfirmEmailAsync([FromQuery] string userId, [FromQuery] string code)
        {
            var origin = Request.Headers["origin"];
            return Ok(await _accountService.ConfirmEmailAsync(userId, code));
        }
        [HttpPost("forgot-password")]
        public async Task<IActionResult> ForgotPassword(ForgotPasswordRequest model)
        {
            await _accountService.ForgotPassword(model, Request.Headers["origin"]);
            return Ok();
        }
        [HttpPost("reset-password")]
        public async Task<IActionResult> ResetPassword(ResetPasswordRequest model)
        {

            return Ok(await _accountService.ResetPassword(model));
        }
        private string GenerateIPAddress()
        {
            if (Request.Headers.ContainsKey("X-Forwarded-For"))
                return Request.Headers["X-Forwarded-For"];
            else
                return HttpContext.Connection.RemoteIpAddress.MapToIPv4().ToString();
        }
    }
}