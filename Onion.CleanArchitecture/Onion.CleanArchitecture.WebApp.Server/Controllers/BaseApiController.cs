using System.Security.Claims;
using Casbin;
using MediatR;
using Microsoft.AspNetCore.Mvc;
using Onion.CleanArchitecture.Application.Exceptions;
using Onion.CleanArchitecture.Application.Interfaces.Repositories;



namespace Onion.CleanArchitecture.WebApp.Server.Controllers
{
    [ApiController]
    [Route("api/v{version:apiVersion}/[controller]")]
    public abstract class BaseApiController : ControllerBase
    {
        private IMediator _mediator;
        protected IMediator Mediator => _mediator ??= HttpContext.RequestServices.GetService<IMediator>();
        private readonly IPolicyRepository _PolicyRepository;
        private bool isProduction = Environment.GetEnvironmentVariable("ASPNETCORE_ENVIRONMENT") == Environments.Production;

        [Obsolete]
        public BaseApiController(IPolicyRepository PolicyRepository)
        {
            _PolicyRepository = PolicyRepository;
        }

        protected async Task<IActionResult> EnforcePermissionAndExecute(string resource, string action, Func<Task<IActionResult>> func)
        {
            if (!isProduction)
                return await func();
            if (HttpContext.User.Identity is ClaimsIdentity identity)
            {
                var userPermission = identity.FindFirst("permission")?.Value;

                var enforcer = await _PolicyRepository.GetEnforcer().EnforceAsync(userPermission, resource, action);
                if (!enforcer)
                {
                    throw new ApiException("You do not have permission to perform this action.", 403);
                }
                return await func();
            }
            throw new ApiException("You are not Authorized", 401);
        }
    }
}
