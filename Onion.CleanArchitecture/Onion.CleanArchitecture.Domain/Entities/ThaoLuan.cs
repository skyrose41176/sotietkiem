using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;
using Onion.CleanArchitecture.Domain.Common;
using Onion.CleanArchitecture.Domain.Models;

namespace Onion.CleanArchitecture.Domain.Entities
{
    public class ThaoLuan: AuditableBaseEntity
    {
        public ThaoLuan()
        {
            DinhKemThaoLuans = new HashSet<DinhKemThaoLuan>();
        }
        public int? ProductId { get; set; }
        public virtual Product? Product { get; set; }
        public string NoiDung { get; set; }
        public int? ParentId { get; set; }
        public int SoLuongPhanHoi { get; set; }
        // public ICollection<DinhKem>? DinhKems { get; set; }
        public ICollection<DinhKemThaoLuan>? DinhKemThaoLuans { get; set; }
        public string UserId { get; set; }
        public virtual ApplicationUser User { get; set; }
    }
}