using Microsoft.AspNetCore.Identity;
using Microsoft.EntityFrameworkCore;
using Microsoft.Extensions.Logging;
using Newtonsoft.Json;
using Onion.CleanArchitecture.CoreWorker.Contexts;
using Onion.CleanArchitecture.CoreWorker.DTOs;
using Onion.CleanArchitecture.CoreWorker.Enums;
using Onion.CleanArchitecture.CoreWorker.Extensions;
using Onion.CleanArchitecture.CoreWorker.Interfaces;
using Onion.CleanArchitecture.CoreWorker.Models;

namespace Onion.CleanArchitecture.CoreWorker.Repositories
{
    public class EmployeeHttpClientAsync : IEmployeeHttpClientAsync
    {
        private readonly HttpClient _httpClient;
        private readonly IdentityContext _identityDbContext;
        private readonly UserManager<ApplicationUser> _userManager;
        private readonly ILogger<EmployeeHttpClientAsync> _logger;
        private readonly SemaphoreSlim _semaphore = new SemaphoreSlim(1, 1);
        public EmployeeHttpClientAsync(HttpClient httpClient, UserManager<ApplicationUser> userManager, IdentityContext identityDbContext, ILogger<EmployeeHttpClientAsync> logger)
        {
            _logger = logger;
            _httpClient = httpClient;
            _userManager = userManager;
            _identityDbContext = identityDbContext;
        }

        public async Task<int> CountUser()
        {
            return await _userManager.Users.CountAsync();
        }

        public async Task<List<EmployeeDto>?> GetEmployeeDtosAsync()
        {
            var response = await _httpClient.GetAsync("/api/nhansu/thongtinnhansu/v4");
            if (response.IsSuccessStatusCode)
            {
                var jsonString = await response.Content.ReadAsStringAsync();
                return JsonConvert.DeserializeObject<List<EmployeeDto>>(jsonString);
            }
            return null;
        }

        public async Task<(int add, int update)> SyncEmployee()
        {
            List<EmployeeDto>? employeeDtos = await GetEmployeeDtosAsync();
            employeeDtos = employeeDtos.Where(x => x.Email != null).ToList();
            employeeDtos.ForEach(x => { x.Email = x.Email.ToLower(); });
            employeeDtos = employeeDtos.GroupBy(e => e.Email).Select(grp => grp.First()).ToList();
            if (employeeDtos != null && employeeDtos.Count > 0)
            {

                var userName = await _userManager.Users.Where(x => x.MaNhanVien != null).Select(x => x.MaNhanVien).ToArrayAsync();
                var empsNotExited = employeeDtos.Where(x => !userName.Contains(x.MaNhanVien) && x.Email != null).ToList();
                empsNotExited = empsNotExited.GroupBy(e => e.Email).Select(grp => grp.First()).ToList();
                var empsExited = employeeDtos.Where(x => userName.Contains(x.MaNhanVien) && x.Email != null).ToList();
                empsExited = empsExited.GroupBy(e => e.Email).Select(grp => grp.First()).ToList();
                int add = await AddEmployeesRange(empsNotExited);
                int update = await UpdateEmployeesRange(empsExited);
                return (empsNotExited.Count, empsExited.Count);
            }
            return (0, 0);
        }

        private async Task<int> AddEmployeesRange(List<EmployeeDto> emps)
        {
            List<ApplicationUser> users = new List<ApplicationUser>();
            foreach (var employee in emps)
            {
                var newUser = new ApplicationUser()
                {
                    MaDonVi = employee.MaDonVi,
                    MaNhanVien = employee.MaNhanVien,
                    ChucVu = employee.ChucVu,
                    Email = employee.Email,
                    UserName = employee.MaNhanVien,
                    NormalizedUserName = employee.MaNhanVien.ToUpper(),
                    NormalizedEmail = employee.Email.ToUpper(),
                    TenDonVi = employee.TenDonVi,
                    TenNhanVien = employee.TenNhanVien,
                    FirstName = employee.TenNhanVien.Substring(0, employee.TenNhanVien.IndexOf(" ")),
                    LastName = employee.TenNhanVien.Substring(employee.TenNhanVien.IndexOf(" ") + 1),
                    EmailConfirmed = employee.NgayRa is null ? true : false, // check nhan vien nghi viec      
                    // NgayRa = employee.NgayRa,
                };
                users.Add(newUser);


            }
            if (users.Count > 0)
            {
                users = users.GroupBy(e => e.Email).Select(grp => grp.First()).ToList();
                await _userManager.AddUserRangeAsync(_identityDbContext, users);
                var tasks = users.Select(user => AddUserToRoleAsync(user, Roles.Basic.ToString())).ToList();
                await Task.WhenAll(tasks);
            }
            return users.Count;
        }

        private async Task AddUserToRoleAsync(ApplicationUser user, string role)
        {
            await _semaphore.WaitAsync();
            try
            {
                await _userManager.AddToRoleAsync(user, role);
            }
            finally
            {
                _semaphore.Release();
            }
        }

        private async Task<int> UpdateEmployeesRange(List<EmployeeDto> emps)
        {
            List<ApplicationUser> users = new List<ApplicationUser>();
            var maNvs = emps.Select(x => x.MaNhanVien).ToArray();
            List<ApplicationUser> userDb = await _identityDbContext.Users.Where(u => maNvs.Contains(u.MaNhanVien)).ToListAsync();
            foreach (var employee in emps)
            {
                var emp = userDb.SingleOrDefault(x => x.MaNhanVien.Equals(employee.MaNhanVien));
                if (emp != null)
                {
                    emp.ChucVu = employee.ChucVu;
                    emp.MaDonVi = employee.MaDonVi;
                    emp.UserName = employee.MaNhanVien;
                    emp.MaNhanVien = employee.MaNhanVien;
                    emp.TenNhanVien = employee.TenNhanVien;
                    emp.TenDonVi = employee.TenDonVi;
                    emp.NormalizedEmail = emp.NormalizedEmail;
                    emp.NormalizedUserName = emp.MaNhanVien.ToUpper();
                    emp.FirstName = employee.TenNhanVien.Substring(0, employee.TenNhanVien.IndexOf(" "));
                    emp.LastName = employee.TenNhanVien.Substring(employee.TenNhanVien.IndexOf(" ") + 1);
                    emp.EmailConfirmed = employee.NgayRa is null ? true : false; // check nhan vien nghi viec
                    users.Add(emp);
                }
            }
            if (users.Count > 0)
            {
                users = users.GroupBy(e => e.Email).Select(grp => grp.First()).ToList();
                await _userManager.UpdateUserRangeAsync(_identityDbContext, users);
            }

            return users.Count;
        }
    }
}
