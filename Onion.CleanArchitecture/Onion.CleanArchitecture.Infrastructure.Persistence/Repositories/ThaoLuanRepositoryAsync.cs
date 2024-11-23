using Microsoft.EntityFrameworkCore;
using Onion.CleanArchitecture.Application.Features.ThaoLuans.Queries.GetAllThaoLuans;
using System.Linq;
using System.Threading.Tasks;
using Onion.CleanArchitecture.Infrastructure.Persistence.Repository;
using Onion.CleanArchitecture.Domain.Entities;
using Onion.CleanArchitecture.Application.Interfaces.Repositories;
using Onion.CleanArchitecture.Infrastructure.Persistence.Contexts;
using Onion.CleanArchitecture.Application.Wrappers;
using Onion.CleanArchitecture.Application.Extensions;

namespace Onion.CleanArchitecture.Infrastructure.Persistence.Repositories
{
    public class ThaoLuanRepositoryAsync : GenericRepositoryAsync<ThaoLuan>, IThaoLuanRepositoryAsync
    {
        private readonly DbSet<ThaoLuan> _thaoLuans;

        public ThaoLuanRepositoryAsync(ApplicationDbContext dbContext) : base(dbContext)
        {
            _thaoLuans = dbContext.Set<ThaoLuan>();
        }

        public async Task<PagedList<ThaoLuan>> GetPagedListAsync(GetAllThaoLuansParameter parameter)
        {
            var thaoLuans = _thaoLuans.AsQueryable();
            if (parameter._filter != null && parameter._filter.Count > 0)
            {
                thaoLuans = MethodExtensions.ApplyFilters(thaoLuans, parameter._filter);
            }

            return await PagedList<ThaoLuan>.ToPagedList(thaoLuans.OrderByDynamic(parameter._sort, parameter._order).AsNoTracking(), parameter._start, parameter._end);
        }

        public async Task<int> CountThaoLuanProductId(int productId, int parentId)
        {
            var thaoLuans = await _thaoLuans
                            .Where(x => x.ProductId == productId)
                            .Where(x => x.ParentId.Equals(parentId))
                            .CountAsync();
            return thaoLuans;

        }
    }
}
