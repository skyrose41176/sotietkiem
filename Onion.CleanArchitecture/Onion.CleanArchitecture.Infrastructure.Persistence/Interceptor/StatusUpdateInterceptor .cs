using Microsoft.EntityFrameworkCore;
using Microsoft.EntityFrameworkCore.Diagnostics;
using Onion.CleanArchitecture.Application.Interfaces;
using Onion.CleanArchitecture.Domain.Entities;
using System;
using System.Linq;
using System.Threading;
using System.Threading.Tasks;
namespace Onion.CleanArchitecture.Infrastructure.Persistence.Interceptor
{
    public class StatusUpdateInterceptor : SaveChangesInterceptor
    {
        private readonly string[] _tablesToTrack;
        private readonly IAuthenticatedUserService _IAuthenticatedUserService;
        // Sử dụng AsyncLocal để lưu trữ cờ theo từng thread
        private static readonly AsyncLocal<bool> _isProcessingStateChangeLog = new AsyncLocal<bool>();
        public StatusUpdateInterceptor(IAuthenticatedUserService IAuthenticatedUserService)
        {
            _IAuthenticatedUserService = IAuthenticatedUserService;
            //đặt bảng có cột State vào list
            _tablesToTrack = new[]
            {
                 typeof(Product).Name,
            };
        }

        public override async ValueTask<int> SavedChangesAsync(SaveChangesCompletedEventData eventData, int result, CancellationToken cancellationToken = default)
        {
            // Nếu đang xử lý StateChangeLog, bỏ qua việc xử lý log thêm lần nữa
            if (_isProcessingStateChangeLog.Value)
            {
                return await base.SavedChangesAsync(eventData, result, cancellationToken);
            }

            var entries = eventData.Context.ChangeTracker.Entries()
                            .Where(e => _tablesToTrack.Contains(e.Entity.GetType().Name)); // Kiểm tra bảng
            foreach (var entry in entries)
            {
                var sourceTable = entry.Entity.GetType().Name; // Lấy tên bảng
                int oldStatus = await eventData.Context.Set<StateChangeLog>()
                                .Where(log =>
                                    log.SourceId == (int)entry.CurrentValues["Id"]
                                    && log.SourceTable == sourceTable)
                                .OrderByDescending(log => log.Id)
                                .Select(log => log.NewStatus)
                                .FirstOrDefaultAsync(); // Trạng thái cũ

                int newStatus = (int)entry.CurrentValues["State"]; // Trạng thái mới

                if ((oldStatus == 0 && newStatus == 0) || (oldStatus != newStatus))
                {
                    // Lấy thời gian của trạng thái cũ từ một StateChangeLog trước đó
                    DateTime? oldStatusTime = await eventData.Context.Set<StateChangeLog>()
                        .Where(log =>
                            log.SourceId == (int)entry.CurrentValues["Id"]
                            && log.SourceTable == sourceTable
                            && log.NewStatus == oldStatus)
                        .OrderByDescending(log => log.Id)
                        .Select(log => log.NewStatusTime)
                        .FirstOrDefaultAsync();

                    // Thời gian hiện tại cho trạng thái mới
                    var newStatusTime = DateTime.Now;
                    // Tính toán khoảng thời gian
                    TimeSpan? duration = oldStatusTime.HasValue ? newStatusTime - oldStatusTime.Value : (TimeSpan?)null;

                    // Tạo bản ghi cho bảng StateChangeLog
                    var changeLog = new StateChangeLog
                    {
                        SourceId = (int)entry.CurrentValues["Id"], // ID của đối tượng đã thay đổi
                        SourceTable = sourceTable,
                        OldStatus = oldStatus,
                        OldStatusTime = oldStatusTime,
                        NewStatus = newStatus,
                        NewStatusTime = newStatusTime,
                        ChangeTime = DateTime.Now,
                        CreatedBy = _IAuthenticatedUserService.UserId,
                        Duration = duration
                    };

                    await eventData.Context.Set<StateChangeLog>().AddAsync(changeLog);
                    // Đánh dấu bắt đầu xử lý StateChangeLog
                    _isProcessingStateChangeLog.Value = true;
                    await eventData.Context.SaveChangesAsync();
                }
            }
            return await base.SavedChangesAsync(eventData, result, cancellationToken); // Tiếp tục quá trình lưu chính
        }
    }

}
