using System.Threading.Tasks;
using Onion.CleanArchitecture.Application.Wrappers;
using Onion.CleanArchitecture.Domain.Entities;
using Onion.CleanArchitecture.Application.Features.ThaoLuans.Queries.GetAllThaoLuans;

namespace Onion.CleanArchitecture.Application.Interfaces.Repositories
{
    public interface IThaoLuanRepositoryAsync : IGenericRepositoryAsync<ThaoLuan>
    {
        Task<PagedList<ThaoLuan>> GetPagedListAsync(GetAllThaoLuansParameter parameter);
        Task<int> CountThaoLuanProductId(int productId, int parentId);
    }
}
