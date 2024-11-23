﻿using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using Onion.CleanArchitecture.Application.Features.Products.Commands.CreateProduct;
using Onion.CleanArchitecture.Application.Features.Products.Commands.DeleteProductById;
using Onion.CleanArchitecture.Application.Features.Products.Commands.DeleteProductByIds;
using Onion.CleanArchitecture.Application.Features.Products.Commands.UpdateProduct;
using Onion.CleanArchitecture.Application.Features.Products.Queries.GetAllProducts;
using Onion.CleanArchitecture.Application.Features.Products.Queries.GetProductById;
using Onion.CleanArchitecture.Application.Interfaces.Repositories;

// For more information on enabling Web API for empty projects, visit https://go.microsoft.com/fwlink/?LinkID=397860

namespace Onion.CleanArchitecture.WebApp.Server.Controllers.v1
{
    [Authorize]
    [Route("api/products")]
    public class ProductController : BaseApiController
    {
        private readonly IPolicyRepository _PolicyRepository;

        [Obsolete]
        public ProductController(IPolicyRepository PolicyRepository) : base(PolicyRepository)
        {
            _PolicyRepository = PolicyRepository;
        }
        // GET: api/<controller>
        [HttpGet]
        public async Task<IActionResult> Get([FromQuery] GetAllProductsParameter filter)
        {
            return await EnforcePermissionAndExecute("products", "list", async () =>
            {
                return Ok(await Mediator.Send(new GetAllProductsQuery()
                {
                    _end = filter._end,
                    _start = filter._start,
                    _order = filter._order,
                    _sort = filter._sort,
                    _filter = filter._filter
                }));
            });
        }

        // GET api/<controller>/5
        [HttpGet("show/{id}")]
        public async Task<IActionResult> Get(int id)
        {
            return await EnforcePermissionAndExecute("products", "show", async () =>
            {
                return Ok(await Mediator.Send(new GetProductByIdQuery { Id = id }));
            });
        }

        // POST api/<controller>
        [HttpPost]
        public async Task<IActionResult> Post(CreateProductCommand command)
        {
            return await EnforcePermissionAndExecute("products", "create", async () =>
            {
                return Ok(await Mediator.Send(command));
            });
        }

        [HttpPost("range")]
        public async Task<IActionResult> PostRange(CreateRangeProductCommand command)
        {
            return await EnforcePermissionAndExecute("products", "create-range", async () =>
            {
                return Ok(await Mediator.Send(command));
            });
        }

        // PUT api/<controller>/5
        [HttpPut("{id}")]
        public async Task<IActionResult> Put(int id, UpdateProductCommand command)
        {
            return await EnforcePermissionAndExecute("products", "edit", async () =>
            {
                if (id != command.Id)
                {
                    return BadRequest();
                }
                return Ok(await Mediator.Send(command));
            });
        }

        // DELETE api/<controller>/5
        [HttpDelete("{id}")]
        public async Task<IActionResult> Delete(int id)
        {
            return await EnforcePermissionAndExecute("products", "delete", async () =>
            {
                return Ok(await Mediator.Send(new DeleteProductByIdCommand { Id = id }));
            });
        }

        // DELETE: api/products/range
        [HttpDelete("range")]
        public async Task<IActionResult> DeleteRange(DeleteProductByIdsCommand command)
        {
            return await EnforcePermissionAndExecute("products", "delete-range", async () =>
            {
                return Ok(await Mediator.Send(command));
            });
        }
    }
}
