using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;
using Onion.CleanArchitecture.Domain.Common;

namespace Onion.CleanArchitecture.Domain.Entities
{
    public class DinhKemThaoLuan : AuditableBaseEntity
    {
        public string? Name { get; set; }
        public int Size { get; set; }
        public string? Type { get; set; }
        public string? Url { get; set; }
        public string? DeleteUrl { get; set; }
        public string? DeleteType { get; set; }
        public string? TenDinhKem { get; set; }
        public string? LoaiDinhKem { get; set; }
        public int ThaoLuanId { get; set; }
        public virtual ThaoLuan ThaoLuan { get; set; }

    }
}