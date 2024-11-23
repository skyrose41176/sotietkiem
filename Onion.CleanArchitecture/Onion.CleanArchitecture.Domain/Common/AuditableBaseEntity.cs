using System;

namespace Onion.CleanArchitecture.Domain.Common
{
    public abstract class AuditableBaseEntity
    {
        public virtual int Id { get; set; }
        public string CreatedBy { get; set; }
        public DateTime Created { get; set; }
        public string LastModifiedBy { get; set; }
        public DateTime? LastModified { get; set; }
        public string DeletedBy { get; set; }
        public DateTime? DeletedAt { get; set; }
        public bool IsDelete { get; set; } = false;

    }
}
