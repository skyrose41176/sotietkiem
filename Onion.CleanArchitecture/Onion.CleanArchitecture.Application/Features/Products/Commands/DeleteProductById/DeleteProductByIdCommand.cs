using MediatR;
using Onion.CleanArchitecture.Application.Exceptions;
using Onion.CleanArchitecture.Application.Interfaces.Repositories;
using Onion.CleanArchitecture.Application.Wrappers;
using System.Threading;
using System.Threading.Tasks;

namespace Onion.CleanArchitecture.Application.Features.Products.Commands.DeleteProductById
{
    public class DeleteProductByIdCommand : IRequest<Response<int>>
    {
        public int Id { get; set; }
        public class DeleteProductByIdCommandHandler : IRequestHandler<DeleteProductByIdCommand, Response<int>>
        {
            private readonly IProductRepositoryAsync _productRepository;
            private readonly IDinhKemRepositoryAsync _dinhKemRepository;

            public DeleteProductByIdCommandHandler(IProductRepositoryAsync productRepository, IDinhKemRepositoryAsync dinhKemRepository)
            {
                _productRepository = productRepository;
                _dinhKemRepository = dinhKemRepository;

            }
            public async Task<Response<int>> Handle(DeleteProductByIdCommand command, CancellationToken cancellationToken)
            {
                var product = await _productRepository.GetByIdAsync(command.Id);
                if (product == null) throw new ApiException($"Product Not Found.");

                #region Đính Kèm
                var dinhKems = await _dinhKemRepository.GetByProductId(command.Id);
                if (dinhKems is not null) await _dinhKemRepository.DeleteRangeAsync(dinhKems);
                #endregion

                await _productRepository.DeleteAsync(product);
                return new Response<int>(product.Id);
            }
        }
    }
}
