using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;
using Onion.Domain.Entities;
using Microsoft.EntityFrameworkCore;
using Onion.CleanArchitecture.Application.Interfaces.Repositories;
using Onion.CleanArchitecture.Infrastructure.Persistence.Repository;
using Onion.CleanArchitecture.Infrastructure.Persistence.Contexts;

namespace Onion.Infrastructure.Persistence.Repositories
{
    public class DinhKemRepositoryAsync : GenericRepositoryAsync<DinhKem>, IDinhKemRepositoryAsync
    {
        private readonly DbSet<DinhKem> _dinhKems;

        public DinhKemRepositoryAsync(ApplicationDbContext dbContext) : base(dbContext)
        {
            _dinhKems = dbContext.Set<DinhKem>();
        }

        public async Task<List<DinhKem>> GetByProductId(int Id)
        {
            var dinhKems = _dinhKems.AsNoTracking()
                            .Where(x => x.ProductId.Equals(Id));
            return await dinhKems.ToListAsync();
        }

        public async Task<List<DinhKem>> GetByProductIds(List<int> Ids)
        {
            var dinhKems = _dinhKems.AsNoTracking()
                            .Where(x => Ids.Contains(x.ProductId));
            return await dinhKems.ToListAsync();
        }
    }
}