﻿using Microsoft.AspNetCore.Mvc;
using Onion.CleanArchitecture.Application.Interfaces.Repositories;
using Onion.CleanArchitecture.Infrastructure.Identity;
using Onion.CleanArchitecture.Infrastructure.Identity.Features.RoleClaim.Commands.CreateRoleClaim;
using Onion.CleanArchitecture.Infrastructure.Identity.Features.RoleClaim.Commands.DeleteRoleClaimById;
using Onion.CleanArchitecture.Infrastructure.Identity.Features.RoleClaim.Commands.UpdateRoleClaim;
using Onion.CleanArchitecture.Infrastructure.Identity.Features.RoleClaim.Queries.GetPagingRoleClaim;
using Onion.CleanArchitecture.Infrastructure.Identity.Features.RoleClaim.Queries.GetRoleClaimById;

namespace Onion.CleanArchitecture.WebApp.Server.Controllers.Identity;

[Route("api/roleclaims")]
[ApiController]
public class RoleClaimsController : BaseApiController
{
    private readonly IPolicyRepository _PolicyRepository;
    [Obsolete]
    public RoleClaimsController(IPolicyRepository PolicyRepository) : base(PolicyRepository)
    {
        _PolicyRepository = PolicyRepository;
    }
    // GET: api/roleclaims?_sort=Id&_order=asc&_start=0&_end=10
    [HttpGet]
    public async Task<IActionResult> Get([FromQuery] GetPagingRoleClaimParameter filter)
    {
        return await EnforcePermissionAndExecute("roleclaims", "list", async () =>
            {
                return Ok(await Mediator.Send(new GetPagingRoleClaimQuery()
                {
                    id = filter.id,
                    _end = filter._end,
                    _start = filter._start,
                    _order = filter._order,
                    _sort = filter._sort,
                    _filter = filter._filter
                }));
            });
    }

    // GET: api/roleclaims/5
    [HttpGet("show/{id}")]
    public async Task<IActionResult> Get(int id)
    {
        return await EnforcePermissionAndExecute("roleclaims", "show", async () =>
            {
                return Ok(await Mediator.Send(new GetRoleClaimByIdQuery() { Id = id }));
            });
    }


    // POST: api/roleclaims
    [HttpPost]
    public async Task<IActionResult> Post(CreateRoleClaimCommand command)
    {
        return await EnforcePermissionAndExecute("roleclaims", "create", async () =>
            {
                return Ok(await Mediator.Send(command));
            });
    }

    // PUT: api/roleclaims/5
    [HttpPut("{id}")]
    public async Task<IActionResult> Put(int id, UpdateRoleClaimCommand command)
    {
        return await EnforcePermissionAndExecute("roleclaims", "edit", async () =>
            {
                if (id != command.Id)
                {
                    return BadRequest();
                }
                return Ok(await Mediator.Send(command));
            });
    }

    // DELETE: api/roleclaims/5
    [HttpDelete("{id}")]
    public async Task<IActionResult> Delete(int id)
    {
        return await EnforcePermissionAndExecute("roleclaims", "delete", async () =>
            {
                return Ok(await Mediator.Send(new DeleteRoleClaimByIdCommand { Id = id }));
            });
    }
}
