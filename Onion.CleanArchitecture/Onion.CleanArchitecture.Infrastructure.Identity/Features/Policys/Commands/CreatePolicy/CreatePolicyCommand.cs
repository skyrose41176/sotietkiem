using System.Data.Entity;
using System.Linq;
using System.Threading;
using System.Threading.Tasks;
using MediatR;
using Microsoft.AspNetCore.Identity;
using Onion.CleanArchitecture.Application.DTOs.Policys;
using Onion.CleanArchitecture.Application.Interfaces.Repositories;
using Onion.CleanArchitecture.Application.Wrappers;
using Onion.CleanArchitecture.Infrastructure.Identity.Contexts;

namespace Onion.CleanArchitecture.Infrastructure.Identity.Features.Policys.Commands.CreatePolicy
{
    public class CreatePolicyCommand : IRequest<Response<Policy>>
    {
        public string Permission { get; set; }
        public string Role { get; set; }
        public string PolicyName { get; set; }
        public string Action { get; set; }
    }

    public class CreatePolicyCommandHandler : IRequestHandler<CreatePolicyCommand, Response<Policy>>
    {
        private readonly IdentityContext _context;
        private readonly IPolicyRepository _policyRepository;

        [System.Obsolete]
        public CreatePolicyCommandHandler(
            IdentityContext context,
             IPolicyRepository policyRepository)
        {
            _context = context;
            _policyRepository = policyRepository;
        }


        public async Task<Response<Policy>> Handle(CreatePolicyCommand request, CancellationToken cancellationToken)
        {
            // Tìm role trong bảng IdentityRole bằng tên
            var role = await _context.Roles
                .FirstOrDefaultAsync(r => r.Name == request.Role, cancellationToken);

            if (role == null)
            {
                return new Response<Policy>("Role không tồn tại.");
            }

            // Lấy tất cả RoleClaims cho role cụ thể
            var roleClaims = await _context.RoleClaims
                .Where(rc => rc.RoleId == role.Id)
                .ToListAsync(cancellationToken);

            // Kiểm tra xem ClaimValue có chứa PolicyName không
            bool roleClaimExists = roleClaims
                .Any(rc => rc.ClaimValue.Split('#').Contains(request.PolicyName));

            if (roleClaimExists)
            {
                return new Response<Policy>("Role claim đã tồn tại cho policy này.");
            }

            // Tạo và thêm policy mới
            var policy = new Policy
            {
                Permission = request.Permission,
                Role = request.Role,
                PolicyName = request.PolicyName,
                Action = request.Action
            };

            await _policyRepository.AddPolicyAsync(policy);

            // Lấy RoleClaim nếu tồn tại với ClaimType == request.PolicyName
            var existingRoleClaim = await _context.RoleClaims
                .FirstOrDefaultAsync(rc => rc.RoleId == role.Id && rc.ClaimType == request.PolicyName, cancellationToken);

            // Nếu RoleClaim đã tồn tại, cập nhật ClaimValue
            if (existingRoleClaim != null)
            {
                // Cập nhật ClaimValue
                var claimValues = existingRoleClaim.ClaimValue.Split('#').ToList();

                // Kiểm tra xem Action đã tồn tại chưa
                if (!claimValues.Contains(request.Action))
                {
                    claimValues.Add(request.Action);
                    existingRoleClaim.ClaimValue = string.Join("#", claimValues);
                }

                // Cập nhật vào cơ sở dữ liệu
                _context.RoleClaims.Update(existingRoleClaim);
            }
            else
            {
                // Nếu chưa có RoleClaim, tạo mới
                var roleClaimValue = request.Action; // Chỉ có Action
                var roleClaim = new IdentityRoleClaim<string>
                {
                    RoleId = role.Id, // Sử dụng Id của role tìm thấy
                    ClaimType = request.PolicyName,
                    ClaimValue = roleClaimValue
                };

                _context.RoleClaims.Add(roleClaim);
            }

            await _context.SaveChangesAsync(cancellationToken);

            return new Response<Policy>(policy, "Policy đã được thêm thành công.");
        }

    }
}