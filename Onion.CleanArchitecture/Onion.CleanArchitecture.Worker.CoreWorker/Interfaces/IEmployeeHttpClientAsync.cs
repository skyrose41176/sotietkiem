using Onion.CleanArchitecture.CoreWorker.DTOs;

namespace Onion.CleanArchitecture.CoreWorker.Interfaces
{
    public interface IEmployeeHttpClientAsync
    {
        Task<List<EmployeeDto>?> GetEmployeeDtosAsync();
        Task<int> CountUser();
        Task<(int add, int update)> SyncEmployee();
    }
}
