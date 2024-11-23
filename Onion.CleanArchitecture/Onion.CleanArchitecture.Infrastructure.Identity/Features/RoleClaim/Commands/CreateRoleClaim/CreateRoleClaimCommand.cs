using Casbin;
using MediatR;
using Microsoft.AspNetCore.Identity;
using Onion.CleanArchitecture.Application.Interfaces.Repositories;
using Onion.CleanArchitecture.Application.Wrappers;
using Onion.CleanArchitecture.Infrastructure.Identity.Contexts;
using System.Threading;
using System.Threading.Tasks;

namespace Onion.CleanArchitecture.Infrastructure.Identity.Features.RoleClaim.Commands.CreateRoleClaim
{
    public class CreateRoleClaimCommand : IRequest<Response<IdentityRoleClaim<string>>>
    {
        public string RoleId { get; set; }
        public string ClaimType { get; set; }
        public string[] ClaimValue { get; set; }

        public class CreateRoleClaimCommandHandler : IRequestHandler<CreateRoleClaimCommand, Response<IdentityRoleClaim<string>>>
        {
            private readonly IdentityContext _context;
            private readonly IPolicyRepository _PolicyRepository;


            [System.Obsolete]
            public CreateRoleClaimCommandHandler(
                IPolicyRepository PolicyRepository,
                IdentityContext context)
            {
                _context = context;
                _PolicyRepository = PolicyRepository;
            }

            public async Task<Response<IdentityRoleClaim<string>>> Handle(CreateRoleClaimCommand request, CancellationToken cancellationToken)
            {
                var roleClaim = new IdentityRoleClaim<string>
                {
                    RoleId = request.RoleId,
                    ClaimType = request.ClaimType,
                    ClaimValue = string.Join("#", request.ClaimValue)
                };
                var role = await _context.Roles.FindAsync(request.RoleId);
                await _PolicyRepository.GetEnforcer().RemoveFilteredPolicyAsync(0, role.Name, request.ClaimType);
                foreach (var value in request.ClaimValue)
                {
                    _PolicyRepository.GetEnforcer().AddPolicy(role.Name, request.ClaimType, value);
                }
                await _PolicyRepository.GetEnforcer().SavePolicyAsync();
                _context.RoleClaims.Add(roleClaim);
                await _context.SaveChangesAsync();

                return new Response<IdentityRoleClaim<string>>(roleClaim);
            }
        }
    }
}
