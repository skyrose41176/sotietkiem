using Onion.CleanArchitecture.Domain.Common;
using Onion.CleanArchitecture.Domain.Entities;

namespace Onion.Domain.Entities
{
    public class DinhKem : AuditableBaseEntity
    {
        public string Name { get; set; }
        public int Size { get; set; }
        public string Type { get; set; }
        public string Url { get; set; }
        public string DeleteUrl { get; set; }
        public string DeleteType { get; set; }
        public string TenDinhKem { get; set; }
        public string LoaiDinhKem { get; set; }
        public int ProductId { get; set; }
    }
}
