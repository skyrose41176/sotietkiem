using Casbin;
using MediatR;
using Microsoft.AspNetCore.Identity;
using Onion.CleanArchitecture.Application.Interfaces.Repositories;
using Onion.CleanArchitecture.Application.Wrappers;
using Onion.CleanArchitecture.Infrastructure.Identity.Contexts;
using System;
using System.Threading;
using System.Threading.Tasks;

namespace Onion.CleanArchitecture.Infrastructure.Identity.Features.RoleClaim.Commands.DeleteRoleClaimById
{
    public class DeleteRoleClaimByIdCommand : IRequest<Response<IdentityRoleClaim<string>>>
    {
        public int Id { get; set; }

        public class DeleteRoleClaimByIdCommandHandler : IRequestHandler<DeleteRoleClaimByIdCommand, Response<IdentityRoleClaim<string>>>
        {
            private readonly IdentityContext _context;
            private readonly IPolicyRepository _PolicyRepository;

            [Obsolete]
            public DeleteRoleClaimByIdCommandHandler(
                IPolicyRepository PolicyRepository,
                IdentityContext context
                )
            {
                _context = context;
                _PolicyRepository = PolicyRepository;
            }
            public async Task<Response<IdentityRoleClaim<string>>> Handle(DeleteRoleClaimByIdCommand request, CancellationToken cancellationToken)
            {
                var roleClaim = _context.RoleClaims.Find(request.Id);
                if (roleClaim == null) throw new Exception($"RoleClaim Not Found.");
                var role = await _context.Roles.FindAsync(roleClaim.RoleId);
                await _PolicyRepository.GetEnforcer().RemoveFilteredPolicyAsync(0, role.Name, roleClaim.ClaimType);
                await _PolicyRepository.GetEnforcer().SavePolicyAsync();
                _context.RoleClaims.Remove(roleClaim);
                _context.SaveChanges();
                return new Response<IdentityRoleClaim<string>>(roleClaim);
            }
        }
    }
}
