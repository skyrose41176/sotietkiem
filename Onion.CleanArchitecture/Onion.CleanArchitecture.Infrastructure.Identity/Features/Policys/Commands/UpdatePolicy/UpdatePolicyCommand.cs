using System;
using System.Collections.Generic;
using System.Data.Entity;
using System.Globalization;
using System.IO;
using System.Linq;
using System.Threading;
using System.Threading.Tasks;
using Casbin;
using CsvHelper;
using CsvHelper.Configuration;
using MediatR;
using Microsoft.AspNetCore.Hosting;
using Microsoft.AspNetCore.Identity;
using Microsoft.Extensions.Configuration;
using Onion.CleanArchitecture.Application.DTOs.Policys;
using Onion.CleanArchitecture.Application.Interfaces.Repositories;
using Onion.CleanArchitecture.Application.Wrappers;
using Onion.CleanArchitecture.Infrastructure.Identity.Contexts;

namespace Onion.CleanArchitecture.Infrastructure.Identity.Features.Policys.Commands.UpdatePolicy
{
    public class UpdatePolicyCommand : IRequest<Response<Policy>>
    {
        public UpdatePolicyRequest Request { get; set; }
    }

    public class UpdatePolicyCommandHandler : IRequestHandler<UpdatePolicyCommand, Response<Policy>>
    {
        private readonly IPolicyRepository _policyRepository;
        private readonly IdentityContext _context; // Để truy cập vào IdentityRoleClaim

        public UpdatePolicyCommandHandler(IPolicyRepository policyRepository, IdentityContext context, IConfiguration configuration)
        {
            _policyRepository = policyRepository;
            _context = context; // Khởi tạo IdentityContext
        }

        public async Task<Response<Policy>> Handle(UpdatePolicyCommand request, CancellationToken cancellationToken)
        {
            var records = new List<Policy>();

            // Đọc dữ liệu từ file CSV
            using (var reader = new StreamReader(_policyRepository.GetFilePath()))
            using (var csv = new CsvReader(reader, new CsvConfiguration(CultureInfo.InvariantCulture)
            {
                HasHeaderRecord = false,
                MissingFieldFound = null
            }))
            {
                csv.Context.RegisterClassMap<PolicyMap>();
                records = csv.GetRecords<Policy>().ToList();
            }

            // Tìm bản ghi cần sửa
            var existingPolicy = records.FirstOrDefault(p =>
                p.Permission == request.Request.Old.Permission &&
                p.Role == request.Request.Old.Role &&
                p.PolicyName == request.Request.Old.PolicyName &&
                p.Action == request.Request.Old.Action);

            if (existingPolicy != null)
            {
                // Cập nhật giá trị
                existingPolicy.Permission = request.Request.New.Permission;
                existingPolicy.Role = request.Request.New.Role;
                existingPolicy.PolicyName = request.Request.New.PolicyName;
                existingPolicy.Action = request.Request.New.Action;

                // Ghi lại toàn bộ dữ liệu vào file CSV
                using (var writer = new StreamWriter(_policyRepository.GetFilePath()))
                using (var csv = new CsvWriter(writer, new CsvConfiguration(CultureInfo.InvariantCulture)
                {
                    HasHeaderRecord = false, // không kiểm tra header
                    ShouldQuote = field => false // Ngăn việc đặt dấu nháy quanh các trường
                }))
                {
                    csv.Context.RegisterClassMap<PolicyMap>();

                    foreach (var record in records)
                    {
                        csv.WriteField(record.Permission);
                        csv.WriteField(record.Role);
                        csv.WriteField(record.PolicyName);
                        csv.WriteField(record.Action);
                        await csv.NextRecordAsync(); // Di chuyển đến dòng tiếp theo
                    }
                }

                var role = await _context.Roles
                            .FirstOrDefaultAsync(r => r.Name.ToLower() == request.Request.Old.Role.ToLower(), cancellationToken);

                if (role == null)
                {
                    return new Response<Policy>("Role không tồn tại.");
                }

                // Cập nhật IdentityRoleClaim
                var roleClaim = await _context.RoleClaims
                    .FirstOrDefaultAsync(rc => rc.ClaimType == request.Request.Old.PolicyName &&
                                                rc.RoleId == role.Id, cancellationToken);

                if (roleClaim != null)
                {
                    // Cập nhật ClaimValue
                    var claimValues = roleClaim.ClaimValue.Split('#').ToList();

                    // Xóa Action cũ nếu nó tồn tại
                    if (claimValues.Contains(request.Request.Old.Action))
                    {
                        claimValues.Remove(request.Request.Old.Action);
                    }

                    // Kiểm tra xem Action mới đã tồn tại chưa
                    if (!claimValues.Contains(request.Request.New.Action))
                    {
                        claimValues.Add(request.Request.New.Action);
                    }

                    // Cập nhật ClaimValue
                    roleClaim.ClaimValue = string.Join("#", claimValues);

                    // Cập nhật vào cơ sở dữ liệu
                    _context.RoleClaims.Update(roleClaim);
                }

                await _context.SaveChangesAsync(cancellationToken);

                return new Response<Policy>(existingPolicy, "Policy đã được cập nhật thành công.");
            }
            else
            {
                return new Response<Policy>("Policy không tìm thấy.");
            }
        }

    }
}
