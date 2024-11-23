using AutoMapper;
using MediatR;
using Microsoft.AspNetCore.Identity;
using Onion.CleanArchitecture.Application.Exceptions;
using Onion.CleanArchitecture.Application.Wrappers;
using Onion.CleanArchitecture.Infrastructure.Identity.Models;
using System.Threading;
using System.Threading.Tasks;

namespace Onion.CleanArchitecture.Infrastructure.Identity
{
    public class UpdateUserCommand : IRequest<Response<ApplicationUser>>
    {
        public string Id { get; set; }
        public string RoleId { get; set; }
        public bool? EmailConfirmed { get; set; }
        public string MaDonVi { get; set; }
        public string TenDonVi { get; set; }

        public class UpdateUserCommandHandler : IRequestHandler<UpdateUserCommand, Response<ApplicationUser>>
        {
            private readonly RoleManager<IdentityRole> _roleManager;
            private readonly UserManager<ApplicationUser> _userManager;
            private readonly IMapper _mapper;
            public UpdateUserCommandHandler(
                UserManager<ApplicationUser> userManager,
                RoleManager<IdentityRole> roleManager,
                IMapper mapper
                )
            {
                _userManager = userManager;
                _roleManager = roleManager;
                _mapper = mapper;
            }

            public async Task<Response<ApplicationUser>> Handle(UpdateUserCommand command, CancellationToken cancellationToken)
            {
                var user = await _userManager.FindByIdAsync(command.Id);
                if (user == null) throw new ApiException($"User Not Found.");
                _mapper.Map(command, user);
                await _userManager.UpdateAsync(user);
                var roles = await _userManager.GetRolesAsync(user);
                // Add user claim for avatar

                if (roles.Count > 0 && command.RoleId != null)
                {
                    var role = await _roleManager.FindByIdAsync(command.RoleId);
                    if (!roles.Contains(command.RoleId))
                    {
                        await _userManager.RemoveFromRolesAsync(user, roles);
                        await _userManager.AddToRoleAsync(user, role.Name);
                    }
                }
                return new Response<ApplicationUser>(user);
            }
        }
    }
}
