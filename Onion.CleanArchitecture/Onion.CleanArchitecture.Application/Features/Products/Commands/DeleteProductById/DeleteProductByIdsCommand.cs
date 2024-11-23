using MediatR;
using Onion.CleanArchitecture.Application.Interfaces.Repositories;
using Onion.CleanArchitecture.Application.Wrappers;
using System.Collections.Generic;
using System.Linq;
using System.Threading;
using System.Threading.Tasks;

namespace Onion.CleanArchitecture.Application.Features.Products.Commands.DeleteProductByIds
{
    public class DeleteProductByIdsCommand : List<int>, IRequest<Response<int>>
    {
        public class DeleteProductByIdsCommandHanlder : IRequestHandler<DeleteProductByIdsCommand, Response<int>>
        {
            private readonly IProductRepositoryAsync _productRepository;
            private readonly IDinhKemRepositoryAsync _dinhKemRepository;

            public DeleteProductByIdsCommandHanlder(IProductRepositoryAsync productRepository, IDinhKemRepositoryAsync dinhKemRepository)
            {
                _productRepository = productRepository;
                _dinhKemRepository = dinhKemRepository;

            }
            public async Task<Response<int>> Handle(DeleteProductByIdsCommand command, CancellationToken cancellationToken)
            {
                List<int> ids = command.ToList();

                #region Đính Kèm
                var dinhKems = await _dinhKemRepository.GetByProductIds(ids);
                if (dinhKems is not null) await _dinhKemRepository.DeleteRangeAsync(dinhKems);
                #endregion

                var deleted = await _productRepository.DeleteRangeAsync(ids);
                await _productRepository.SaveChangesAsync();
                return new Response<int>(deleted);
            }
        }
    }
}
