using System;

namespace Onion.CleanArchitecture.Domain.Entities
{
    public class StateChangeLog
    {
        public virtual int Id { get; set; }
        public int SourceId { get; set; } // ID của đối tượng đã thay đổi
        public string SourceTable { get; set; } // Tên bảng của đối tượng thay đổi
        public int OldStatus { get; set; } // Trạng thái cũ của đối tượng
        public DateTime? OldStatusTime { get; set; } // Thời gian trạng thái cũ
        public int NewStatus { get; set; } // Trạng thái mới của đối tượng
        public DateTime? NewStatusTime { get; set; } // Thời gian trạng thái mới
        public DateTime ChangeTime { get; set; } // Thời gian thay đổi
        public TimeSpan? Duration { get; set; } // Khoảng thời gian từ OldStatus đến NewStatus
        public string CreatedBy { get; set; }
    }
}