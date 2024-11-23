using Microsoft.AspNetCore.Identity;
using Onion.CleanArchitecture.Application.DTOs.Account;
using System.Collections.Generic;
using System.ComponentModel.DataAnnotations.Schema;

namespace Onion.CleanArchitecture.Infrastructure.Identity.Models
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
        public List<RefreshToken> RefreshTokens { get; set; }
        public bool OwnsToken(string token)
        {
            return this.RefreshTokens?.Find(x => x.Token == token) != null;
        }
    }
}
