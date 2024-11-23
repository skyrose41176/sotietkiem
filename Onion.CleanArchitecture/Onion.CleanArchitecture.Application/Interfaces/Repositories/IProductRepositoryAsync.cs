﻿using Onion.CleanArchitecture.Application.Features.Products.Queries.GetAllProducts;
using Onion.CleanArchitecture.Application.Wrappers;
using Onion.CleanArchitecture.Domain.Entities;
using System.Collections.Generic;
using System.Threading;
using System.Threading.Tasks;

namespace Onion.CleanArchitecture.Application.Interfaces.Repositories
{
        public interface IProductRepositoryAsync : IGenericRepositoryAsync<Product>
        {
                Task<bool> IsUniqueBarcodeAsync(string barcode);
                Task<int> DeleteRangeAsync(List<int> ids);
                Task<PagedList<Product>> GetPagedProductsAsync(GetAllProductsParameter parameter);
                Task<Product> GetProductById(int id, CancellationToken cancellationToken);

        }
}
