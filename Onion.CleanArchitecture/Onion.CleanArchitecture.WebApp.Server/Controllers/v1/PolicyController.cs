using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using Onion.CleanArchitecture.Application.DTOs.Policys;
using Onion.CleanArchitecture.Application.Features.Policys.Queries;
using Onion.CleanArchitecture.Application.Interfaces.Repositories;
using Onion.CleanArchitecture.Application.Wrappers;
using Onion.CleanArchitecture.Infrastructure.Identity.Features.Policys.Commands.CreatePolicy;
using Onion.CleanArchitecture.Infrastructure.Identity.Features.Policys.Commands.DeletePolicy;
using Onion.CleanArchitecture.Infrastructure.Identity.Features.Policys.Commands.ExportPolicy;
using Onion.CleanArchitecture.Infrastructure.Identity.Features.Policys.Commands.UpdatePolicy;
using Onion.CleanArchitecture.WebApp.Server.Controllers;

[Authorize]
[Route("api/policy")]
public class PolicyController : BaseApiController
{

    private readonly IPolicyRepository _PolicyRepository;
    [Obsolete]
    public PolicyController(
        IPolicyRepository PolicyRepository) : base(PolicyRepository)
    {
        _PolicyRepository = PolicyRepository;
    }

    [HttpGet]
    public async Task<IActionResult> GetAllPolicies([FromQuery] GetAllPoliciesParameter filter)
    {
        try
        {
            var result = await Mediator.Send(new GetAllPoliciesQuery()
            {
                _end = filter._end,
                _start = filter._start,
                _order = filter._order,
                _sort = filter._sort,
                _filter = filter._filter,
                // id = filter.id,
            });

            return Ok(result);
        }
        catch (ArgumentException ex)
        {
            return BadRequest(new { Succeeded = false, Code = 0, Message = ex.Message, Errors = (string[])null, Data = (object)null });
        }
    }
    [HttpPost]
    public async Task<IActionResult> Post(CreatePolicyCommand command)
    {
        return Ok(await Mediator.Send(command));
    }

    [HttpPut("update")]
    public async Task<IActionResult> UpdatePolicy([FromBody] UpdatePolicyRequest updatedPolicy)
    {
        var command = new UpdatePolicyCommand { Request = updatedPolicy };
        return Ok(await Mediator.Send(command));
    }

    [HttpPut("delete")]
    public async Task<IActionResult> DeletePolicy([FromBody] Policy deletePolicy)
    {
        var command = new DeletePolicyCommand { Request = deletePolicy };
        return Ok(await Mediator.Send(command));

    }

    [HttpPost("export")]
    public async Task<IActionResult> ExportPolicies()
    {
        var result = await Mediator.Send(new ExportPolicyCommand());

        if (result.Succeeded && result.Data != null)
        {
            var response = new Response<FileContentResult>(result.Data, "Policies exported successfully.");
            return Ok(response);
        }

        return BadRequest(result);
    }
}
