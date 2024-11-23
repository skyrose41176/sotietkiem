using System.Collections.Generic;
using System.Threading.Tasks;
using Casbin;
using Onion.Domain.Entities;
using Onion.CleanArchitecture.Application.DTOs.Policys;
using Onion.CleanArchitecture.Application.Features.Policys.Queries;
using Onion.CleanArchitecture.Application.Wrappers;

namespace Onion.CleanArchitecture.Application.Interfaces.Repositories
{
    public interface IDinhKemRepositoryAsync : IGenericRepositoryAsync<DinhKem>
    {
        Task<List<DinhKem>> GetByProductId(int Id);
        Task<List<DinhKem>> GetByProductIds(List<int> Ids);        
    }
}
