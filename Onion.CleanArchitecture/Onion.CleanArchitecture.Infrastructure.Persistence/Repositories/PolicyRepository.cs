using System;
using System.Collections.Generic;
using System.Globalization;
using System.IO;
using System.Linq;
using System.Threading.Tasks;
using Casbin;
using CsvHelper;
using CsvHelper.Configuration;
using Microsoft.AspNetCore.Hosting;
using Microsoft.Extensions.Configuration;
using Microsoft.Extensions.Hosting;
using Onion.CleanArchitecture.Application.DTOs.Policys;
using Onion.CleanArchitecture.Application.Extensions;
using Onion.CleanArchitecture.Application.Features.Policys.Queries;
using Onion.CleanArchitecture.Application.Interfaces.Repositories;
using Onion.CleanArchitecture.Application.Wrappers;


namespace Onion.CleanArchitecture.Infrastructure.Persistence.Repositories
{
    public class PolicyRepository : IPolicyRepository
    {
        private readonly string _filePath;
        private bool isProduction = Environment.GetEnvironmentVariable("ASPNETCORE_ENVIRONMENT") == Environments.Production;
        private readonly Enforcer _enforcer;
        private static IWebHostEnvironment _webHostEnvironment;
        private static IConfiguration _configuration;
        private static string ServiceName;
        public PolicyRepository(IConfiguration configuration, IWebHostEnvironment webHostEnvironment)
        {
            _configuration = configuration;
            ServiceName = _configuration["ServiceName"] ?? "onion";
            _webHostEnvironment = webHostEnvironment;
            Console.WriteLine($"CSV file path: {_filePath}");
            if (isProduction)
            {
                ServiceName = Environment.GetEnvironmentVariable("SERVICE_NAME") ?? "onion";
            }
            _filePath = Path.Combine(_webHostEnvironment.WebRootPath, "policy", ServiceName, "policy.csv");
            _enforcer = new Enforcer(Path.Combine(_webHostEnvironment.WebRootPath, "policy", ServiceName, "model.conf"), _filePath);
            if (string.IsNullOrEmpty(_filePath))
            {
                throw new ArgumentNullException(nameof(_filePath), "File path cannot be null or empty.");
            }
        }
        public Enforcer GetEnforcer()
        {
            return _enforcer;
        }
        public string GetFilePath()
        {
            return _filePath;
        }
        public async Task<PagedList<Policy>> GetAllPolicies(GetAllPoliciesParameter request)
        {
            using (var reader = new StreamReader(_filePath))
            using (var csv = new CsvReader(reader, new CsvConfiguration(CultureInfo.InvariantCulture)
            {
                HasHeaderRecord = false, // Disable header checking
                MissingFieldFound = null // Ignore missing field errors
            }))
            {
                csv.Context.RegisterClassMap<PolicyMap>();
                var records = csv.GetRecords<Policy>().ToList();

                // Set the Id property
                for (int i = 0; i < records.Count; i++)
                {
                    records[i].Id = i + 1; // Set Id as index + 1
                }

                if (!typeof(Policy).GetProperties().Any(p => p.Name.Equals(request._sort, StringComparison.OrdinalIgnoreCase)))
                {
                    throw new ArgumentException($"Property {request._sort} not found on type Policy");
                }

                var sortedRecords = records.AsQueryable().OrderByDynamic(request._sort, request._order).ToList();

                var pagedRecords = sortedRecords.Skip(request._start).Take(request._end - request._start).ToList();

                var pagedList = new PagedList<Policy>(pagedRecords, sortedRecords.Count, request._start, request._end - request._start);

                return pagedList;
            }
        }
        public async Task AddPolicyAsync(Policy newPolicy)
        {
            var records = new List<Policy>();

            // Đọc dữ liệu từ file CSV
            using (var reader = new StreamReader(_filePath))
            using (var csv = new CsvReader(reader, new CsvConfiguration(CultureInfo.InvariantCulture)
            {
                HasHeaderRecord = false,
                MissingFieldFound = null
            }))
            {
                csv.Context.RegisterClassMap<PolicyMap>();
                records = csv.GetRecords<Policy>().ToList();
            }

            // Kiểm tra nếu policy đã tồn tại
            var existingPolicy = records.FirstOrDefault(p =>
                p.Permission == newPolicy.Permission &&
                p.Role == newPolicy.Role &&
                p.PolicyName == newPolicy.PolicyName &&
                p.Action == newPolicy.Action);

            if (existingPolicy != null)
            {
                throw new ArgumentException("Policy already exists.");
            }

            // Thêm policy mới vào danh sách
            records.Add(newPolicy);

            // Ghi lại toàn bộ dữ liệu vào file CSV
            using (var writer = new StreamWriter(_filePath))
            using (var csv = new CsvWriter(writer, new CsvConfiguration(CultureInfo.InvariantCulture)
            {
                HasHeaderRecord = false,
                ShouldQuote = field => false  // Ngăn việc đặt dấu nháy quanh các trường
            }))
            {
                csv.Context.RegisterClassMap<PolicyMap>();

                // Ghi từng record
                foreach (var record in records)
                {
                    csv.WriteField(record.Permission);
                    csv.WriteField(record.Role);
                    csv.WriteField(record.PolicyName);
                    csv.WriteField(record.Action);
                    await csv.NextRecordAsync(); // Di chuyển đến dòng tiếp theo
                }
            }
        }


        public async Task UpdatePolicyAsync(UpdatePolicyRequest updatedPolicy)
        {
            var records = new List<Policy>();

            // Đọc dữ liệu từ file CSV
            using (var reader = new StreamReader(_filePath))
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
                p.Permission == updatedPolicy.Old.Permission &&
                p.Role == updatedPolicy.Old.Role &&
                p.PolicyName == updatedPolicy.Old.PolicyName &&
                p.Action == updatedPolicy.Old.Action);

            if (existingPolicy != null)
            {
                // Cập nhật giá trị
                existingPolicy.Permission = updatedPolicy.New.Permission;
                existingPolicy.Role = updatedPolicy.New.Role;
                existingPolicy.PolicyName = updatedPolicy.New.PolicyName;
                existingPolicy.Action = updatedPolicy.New.Action;

                // Ghi lại toàn bộ dữ liệu vào file CSV
                using (var writer = new StreamWriter(_filePath))
                using (var csv = new CsvWriter(writer, new CsvConfiguration(CultureInfo.InvariantCulture)
                {
                    HasHeaderRecord = false // Disable header checking
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
            }
            else
            {
                throw new ArgumentException("Policy not found.");
            }
        }
        public async Task DeletePolicyAsync(string permission, string role, string policyName, string action)
        {
            var records = new List<Policy>();

            // Đọc dữ liệu từ file CSV
            using (var reader = new StreamReader(_filePath))
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
                p.Permission == permission &&
                p.Role == role &&
                p.PolicyName == policyName &&
                p.Action == action);

            if (policyToDelete != null)
            {
                // Xóa bản ghi
                records.Remove(policyToDelete);

                // Ghi lại toàn bộ dữ liệu vào file CSV
                using (var writer = new StreamWriter(_filePath))
                using (var csv = new CsvWriter(writer, new CsvConfiguration(CultureInfo.InvariantCulture)
                {
                    HasHeaderRecord = false // Disable header checking
                }))
                {
                    csv.Context.RegisterClassMap<PolicyMap>();

                    foreach (var record in records)
                    {
                        csv.WriteRecord(record);
                        await csv.NextRecordAsync(); // Di chuyển đến dòng tiếp theo
                    }
                }
            }
            else
            {
                throw new ArgumentException("Policy not found.");
            }
        }

    }
}