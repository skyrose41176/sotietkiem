
using Onion.CleanArchitecture.Application.Features.ThaoLuans.Commands.CreateThaoLuan;
using Onion.CleanArchitecture.Application.Features.ThaoLuans.Commands.DeleteThaoLuan;
using Onion.CleanArchitecture.Application.Features.ThaoLuans.Commands.UpdateThaoLuan;
using Onion.CleanArchitecture.Application.Features.ThaoLuans.Queries.GetAllThaoLuans;
using Onion.CleanArchitecture.Application.Features.ThaoLuans.Queries.GetThaoLuanById;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using Onion.CleanArchitecture.Application.Interfaces.Repositories;

namespace Onion.CleanArchitecture.WebApp.Server.Controllers.v1
{
    [Authorize]
    [Route("api/thaoluans")]
    public class ThaoLuanController : BaseApiController
    {
        private readonly IPolicyRepository _PolicyRepository;
        [Obsolete]
        public ThaoLuanController(IPolicyRepository PolicyRepository) : base(PolicyRepository)
        {
            _PolicyRepository = PolicyRepository;
        }
        // GET: api/<controller>
        [HttpGet]
        public async Task<IActionResult> Get([FromQuery] GetAllThaoLuansParameter filter)
        {
            return await EnforcePermissionAndExecute("thaoluans", "list", async () =>
            {
                return Ok(await Mediator.Send(new GetAllThaoLuansQuery()
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
            return await EnforcePermissionAndExecute("thaoluans", "show", async () =>
            {
                return Ok(await Mediator.Send(new GetThaoLuanByIdQuery { Id = id }));
            });
        }

        // POST api/<controller>
        [HttpPost]
        public async Task<IActionResult> Post(CreateThaoLuanCommand command)
        {
            return await EnforcePermissionAndExecute("thaoluans", "create", async () =>
            {
                return Ok(await Mediator.Send(command));
            });
        }

        // PUT api/<controller>/5
        [HttpPut("{id}")]
        public async Task<IActionResult> Put(int id, UpdateThaoLuanCommand command)
        {
            return await EnforcePermissionAndExecute("thaoluans", "edit", async () =>
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
            return await EnforcePermissionAndExecute("thaoluans", "delete", async () =>
            {
                return Ok(await Mediator.Send(new DeleteThaoLuanByIdCommand { Id = id }));
            });
        }
    }
}
