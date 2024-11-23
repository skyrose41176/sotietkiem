﻿using MediatR;
using Onion.CleanArchitecture.Application.Exceptions;
using Onion.CleanArchitecture.Application.Wrappers;
using Onion.CleanArchitecture.Infrastructure.Identity.Contexts;
using System.Threading;
using System.Threading.Tasks;

namespace Onion.CleanArchitecture.Infrastructure.Identity.Features.RoleClaim.Queries.GetRoleClaimById
{
    public class GetRoleClaimByIdQuery : IRequest<Response<RoleClaimResponse>>
    {
        public int Id { get; set; }

        public class GetRoleClaimByIdQueryHandler : IRequestHandler<GetRoleClaimByIdQuery, Response<RoleClaimResponse>>
        {
            private readonly IdentityContext _context;
            public GetRoleClaimByIdQueryHandler(IdentityContext context)
            {
                _context = context;
            }

            public async Task<Response<RoleClaimResponse>> Handle(GetRoleClaimByIdQuery query, CancellationToken cancellationToken)
            {
                var roleClaim = await _context.RoleClaims.FindAsync(query.Id);
                if (roleClaim == null) throw new ApiException($"RoleClaim Not Found.");

                return new Response<RoleClaimResponse>(new RoleClaimResponse
                {
                    Id = roleClaim.Id,
                    RoleId = roleClaim.RoleId,
                    ClaimType = roleClaim.ClaimType,
                    ClaimValue = roleClaim.ClaimValue.Split("#")
                });
            }
        }
    }

    public class RoleClaimResponse
    {
        public int Id { get; set; }
        public string RoleId { get; set; }
        public string ClaimType { get; set; }
        public string[] ClaimValue { get; set; }
    }
}
