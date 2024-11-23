using Microsoft.AspNetCore.Identity;
using System.ComponentModel.DataAnnotations.Schema;

namespace Onion.CleanArchitecture.Domain.Models
{
    public class ApplicationUser : IdentityUser
    {
        public string FirstName { get; set; }
        public string LastName { get; set; }
        [NotMapped]
        public string RoleId { get; set; }
        public string? TenNhanVien { get; set; }
        public string? MaNhanVien { get; set; }
        public string? ChucVu { get; set; }
        public string? MaDonVi { get; set; }
        public string? TenDonVi { get; set; }
    }
}