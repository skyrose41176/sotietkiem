using System;
using System.Collections.Generic;
using System.Data.Entity;
using System.Globalization;
using System.IO;
using System.Linq;
using System.Threading;
using System.Threading.Tasks;
using CsvHelper;
using CsvHelper.Configuration;
using MediatR;
using Microsoft.Extensions.Configuration;
using Onion.CleanArchitecture.Application.DTOs.Policys;
using Onion.CleanArchitecture.Application.Interfaces.Repositories;
using Onion.CleanArchitecture.Application.Wrappers;
using Onion.CleanArchitecture.Infrastructure.Identity.Contexts;

namespace Onion.CleanArchitecture.Infrastructure.Identity.Features.Policys.Commands.DeletePolicy
{
    public class DeletePolicyCommand : IRequest<Response<Policy>>
    {
        public Policy Request { get; set; }
    }

    public class DeletePolicyCommandHandler : IRequestHandler<DeletePolicyCommand, Response<Policy>>
    {
        private readonly IPolicyRepository _policyRepository;
        private readonly IdentityContext _context; // Để truy cập vào IdentityRoleClaim

        public DeletePolicyCommandHandler(IPolicyRepository policyRepository, IdentityContext context, IConfiguration configuration)
        {
            _policyRepository = policyRepository;
            _context = context; // Khởi tạo IdentityContext
        }

        public async Task<Response<Policy>> Handle(DeletePolicyCommand request, CancellationToken cancellationToken)
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

            // Tìm bản ghi cần xóa
            var policyToDelete = records.FirstOrDefault(p =>
                p.Permission == request.Request.Permission &&
                p.Role == request.Request.Role &&
                p.PolicyName == request.Request.PolicyName &&
                p.Action == request.Request.Action);

            if (policyToDelete != null)
            {
                // Xóa bản ghi
                records.Remove(policyToDelete);

                // Ghi lại toàn bộ dữ liệu vào file CSV
                using (var writer = new StreamWriter(_policyRepository.GetFilePath()))
                using (var csv = new CsvWriter(writer, new CsvConfiguration(CultureInfo.InvariantCulture)
                {
                    HasHeaderRecord = false, // Disable header checking
                    ShouldQuote = field => false // Ngăn việc đặt dấu nháy quanh các trường
                }))
                {
                    csv.Context.RegisterClassMap<PolicyMap>();

                    foreach (var record in records)
                    {
                        csv.WriteRecord(record);
                        await csv.NextRecordAsync(); // Di chuyển đến dòng tiếp theo
                    }
                }

                var role = await _context.Roles
                    .FirstOrDefaultAsync(r => r.Name.ToLower() == request.Request.Role.ToLower(), cancellationToken);

                if (role == null)
                {
                    return new Response<Policy>("Role không tồn tại.");
                }

                // Cập nhật IdentityRoleClaim
                var roleClaim = await _context.RoleClaims
                    .FirstOrDefaultAsync(rc => rc.ClaimType == request.Request.PolicyName &&
                                                rc.RoleId == role.Id, cancellationToken);

                if (roleClaim != null)
                {
                    // Cập nhật ClaimValue
                    var claimValues = roleClaim.ClaimValue.Split('#').ToList();

                    // Xóa Action cũ nếu nó tồn tại
                    if (claimValues.Contains(request.Request.Action))
                    {
                        claimValues.Remove(request.Request.Action);
                    }

                    // Xóa giá trị đầu tiên nếu nó không chứa ký tự '#'
                    if (claimValues.Count > 0 && claimValues[0] == request.Request.Action)
                    {
                        claimValues.RemoveAt(0);
                    }

                    // Kiểm tra ClaimValue
                    if (claimValues.Count == 0 || (claimValues.Count == 1 && string.IsNullOrEmpty(claimValues[0])))
                    {
                        // Xóa dòng IdentityRoleClaim nếu claimValues trống hoặc chỉ có một phần tử rỗng
                        _context.RoleClaims.Remove(roleClaim);
                    }
                    else
                    {
                        // Cập nhật ClaimValue mới
                        roleClaim.ClaimValue = string.Join("#", claimValues);
                        _context.RoleClaims.Update(roleClaim);
                    }
                }

                await _context.SaveChangesAsync(cancellationToken);
                return new Response<Policy>("Policy deleted successfully.");
            }
            else
            {
                return new Response<Policy>("Policy not found.");
            }
        }
    }
}