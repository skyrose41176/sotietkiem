using System.Collections.Generic;
using Onion.Domain.Entities;
using Onion.CleanArchitecture.Domain.Common;

namespace Onion.CleanArchitecture.Domain.Entities
{
        public class Product : AuditableBaseEntity
        {
                public Product()
                {
                        ThaoLuans = new HashSet<ThaoLuan>();
                        DinhKems = new HashSet<DinhKem>();
                }
                public string Name { get; set; }
                public string Barcode { get; set; }
                public string Description { get; set; }
                public decimal? Rate { get; set; }
                public decimal? Price { get; set; }
                public StateProduct? State { get; set; }
                public ICollection<ThaoLuan> ThaoLuans { get; set; }
                public ICollection<DinhKem> DinhKems { get; set; }
        }
        public enum StateProduct
        {
                Khong,
                Mot,
                Hai
        }
}
