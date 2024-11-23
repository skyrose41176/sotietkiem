using System;
using System.Collections.Generic;
using System.Globalization;
using System.IO;
using System.Linq;
using System.Threading;
using System.Threading.Tasks;
using CsvHelper;
using CsvHelper.Configuration;
using Onion.CleanArchitecture.Application.Interfaces.Repositories;
using Onion.CleanArchitecture.Application.Wrappers;
using Onion.CleanArchitecture.Infrastructure.Identity.Contexts;
using MediatR;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using Microsoft.Extensions.Configuration;

namespace Onion.CleanArchitecture.Infrastructure.Identity.Features.Policys.Commands.ExportPolicy
{
    public class ExportPolicyCommand : IRequest<Response<FileContentResult>>
    {
        // Command có thể mở rộng thêm tham số nếu cần trong tương lai
    }

    public class ExportPolicyCommandHandler : IRequestHandler<ExportPolicyCommand, Response<FileContentResult>>
    {
        private readonly IPolicyRepository _policyRepository;
        private readonly IdentityContext _context;

        public ExportPolicyCommandHandler(IPolicyRepository policyRepository, IdentityContext context, IConfiguration configuration)
        {
            _policyRepository = policyRepository;
            _context = context;


        }

        public async Task<Response<FileContentResult>> Handle(ExportPolicyCommand request, CancellationToken cancellationToken)
        {
            try
            {
                var roleClaims = await _context.RoleClaims
                    .Join(_context.Roles,
                          rc => rc.RoleId,
                          r => r.Id,
                          (rc, r) => new { rc.ClaimType, rc.ClaimValue, RoleName = r.Name })
                    .ToListAsync(cancellationToken);

                if (!roleClaims.Any())
                {
                    return new Response<FileContentResult>(null, "No RoleClaims available to export.");
                }

                try
                {
                    var exportFilePath = Path.Combine(Path.GetTempPath(), "policy.csv");
                    using (var writer = new StreamWriter(exportFilePath))
                    using (var csv = new CsvWriter(writer, new CsvConfiguration(CultureInfo.InvariantCulture)
                    {
                        HasHeaderRecord = true,    // Write the header record
                        ShouldQuote = field => false  // Prevent quoting fields unless necessary
                    }))
                    {

                        foreach (var roleClaim in roleClaims)
                        {
                            var actions = roleClaim.ClaimValue?.Split('#') ?? Array.Empty<string>();
                            foreach (var action in actions)
                            {
                                csv.WriteField("p");
                                csv.WriteField(roleClaim.RoleName ?? "UnknownRole");
                                csv.WriteField(roleClaim.ClaimType ?? "UnknownClaimType");
                                csv.WriteField(action ?? "UnknownAction");
                                await csv.NextRecordAsync();
                            }
                        }
                    }

                    var bytes = await File.ReadAllBytesAsync(exportFilePath);

                    var fileContent = new FileContentResult(bytes, "application/vnd.ms-excel")
                    {
                        FileDownloadName = "RoleClaims.csv"
                    };

                    return new Response<FileContentResult>(fileContent, "RoleClaims have been successfully exported.");
                }
                catch (Exception ex)
                {
                    Console.Error.WriteLine($"An error occurred while writing the CSV file: {ex.Message} - StackTrace: {ex.StackTrace}");
                    return new Response<FileContentResult>(null, $"An error occurred while writing the CSV file: {ex.Message}");
                }
            }
            catch (Exception ex)
            {
                return new Response<FileContentResult>(null, $"An unexpected error occurred: {ex.Message}");
            }
        }
    }
}
