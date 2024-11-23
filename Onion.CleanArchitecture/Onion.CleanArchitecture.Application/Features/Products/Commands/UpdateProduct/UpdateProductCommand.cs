using Onion.Domain.Entities;
using MediatR;
using Onion.CleanArchitecture.Application.Exceptions;
using Onion.CleanArchitecture.Application.Interfaces.Repositories;
using Onion.CleanArchitecture.Application.Wrappers;
using Onion.CleanArchitecture.Domain.Entities;
using System.Collections.Generic;
using System.Linq;
using System.Threading;
using System.Threading.Tasks;
using Onion.CleanArchitecture.Application.Extensions;
using AutoMapper;

namespace Onion.CleanArchitecture.Application.Features.Products.Commands.UpdateProduct
{
    public class UpdateProductCommand : IRequest<Response<int>>
    {
        public int Id { get; set; }
        public string Name { get; set; }
        public string Description { get; set; }
        public decimal? Rate { get; set; }
        public decimal? Price { get; set; }
        public StateProduct? State { get; set; }
        public ICollection<DinhKem> DinhKems { get; set; }

        public class UpdateProductCommandHandler : IRequestHandler<UpdateProductCommand, Response<int>>
        {
            private readonly IProductRepositoryAsync _productRepository;
            private readonly IDinhKemRepositoryAsync _dinhKemRepository;
            private readonly IMapper _mapper;


            public UpdateProductCommandHandler(IProductRepositoryAsync productRepository, IDinhKemRepositoryAsync dinhKemRepository, IMapper mapper)
            {
                _productRepository = productRepository;
                _dinhKemRepository = dinhKemRepository;
                _mapper = mapper;

            }
            public async Task<Response<int>> Handle(UpdateProductCommand command, CancellationToken cancellationToken)
            {
                var product = await _productRepository.GetProductById(command.Id, cancellationToken);

                if (product == null)
                {
                    throw new ApiException($"Product Not Found.");
                }
                else
                {
                    var newProduct = _mapper.Map<Product>(product);

                    #region Đính Kèm
                    // Thêm các đính kèm mới và thiết lập quan hệ
                    if (command?.DinhKems != null)
                    {
                        await _dinhKemRepository.DeleteRangeAsync(product.DinhKems.ToList());
                        foreach (var dinhKem in command.DinhKems)
                        {
                            dinhKem.ProductId = product.Id; // Thiết lập ProductId
                            await _dinhKemRepository.AddAsync(dinhKem); // Thêm từng đính kèm
                        }
                        product.DinhKems = command.DinhKems;
                    }
                    #endregion

                    await _productRepository.UpdateColumnsAsync(newProduct);
                    return new Response<int>(product.Id);
                }
            }
        }
    }
}
