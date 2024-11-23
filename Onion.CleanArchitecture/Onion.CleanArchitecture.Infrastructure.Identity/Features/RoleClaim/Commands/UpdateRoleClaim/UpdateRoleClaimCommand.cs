using Casbin;
using MediatR;
using Microsoft.AspNetCore.Identity;
using Onion.CleanArchitecture.Application.Interfaces.Repositories;
using Onion.CleanArchitecture.Application.Wrappers;
using Onion.CleanArchitecture.Infrastructure.Identity.Contexts;
using System;
using System.Threading;
using System.Threading.Tasks;

namespace Onion.CleanArchitecture.Infrastructure.Identity.Features.RoleClaim.Commands.UpdateRoleClaim
{
    public class UpdateRoleClaimCommand : IRequest<Response<IdentityRoleClaim<string>>>
    {
        public int Id { get; set; }
        public string ClaimType { get; set; }
        public string[] ClaimValue { get; set; }

        public class UpdateRoleClaimCommandHandler : IRequestHandler<UpdateRoleClaimCommand, Response<IdentityRoleClaim<string>>>
        {
            private readonly IdentityContext _context;
            private readonly IPolicyRepository _PolicyRepository;

            [Obsolete]
            public UpdateRoleClaimCommandHandler(
                IdentityContext context,
                IPolicyRepository PolicyRepository
                )
            {
                _context = context;
                _PolicyRepository = PolicyRepository;
            }

            public async Task<Response<IdentityRoleClaim<string>>> Handle(UpdateRoleClaimCommand request, CancellationToken cancellationToken)
            {
                var roleClaim = await _context.RoleClaims.FindAsync(request.Id);
                if (roleClaim == null) throw new Exception($"RoleClaim Not Found.");
                var role = await _context.Roles.FindAsync(roleClaim.RoleId);
                await _PolicyRepository.GetEnforcer().RemoveFilteredPolicyAsync(0, role.Name, request.ClaimType);
                foreach (var value in request.ClaimValue)
                {
                    await _PolicyRepository.GetEnforcer().AddPolicyAsync(role.Name, request.ClaimType, value);
                }
                await _PolicyRepository.GetEnforcer().SavePolicyAsync();

                roleClaim.ClaimType = request.ClaimType;
                roleClaim.ClaimValue = string.Join("#", request.ClaimValue);
                await _context.SaveChangesAsync();

                return new Response<IdentityRoleClaim<string>>(roleClaim);
            }
        }
    }
}
