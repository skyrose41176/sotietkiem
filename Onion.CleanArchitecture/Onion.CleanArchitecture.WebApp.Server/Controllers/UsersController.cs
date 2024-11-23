using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using Onion.CleanArchitecture.Application.Interfaces.Repositories;
using Onion.CleanArchitecture.Infrastructure.Identity;
using Onion.CleanArchitecture.Infrastructure.Identity.Features.Users.Queries.CreateUser;
using Onion.CleanArchitecture.Infrastructure.Identity.Features.Users.Queries.GetPagingUser;
using Onion.CleanArchitecture.Infrastructure.Identity.Features.Users.Queries.GetUserById;

namespace Onion.CleanArchitecture.WebApp.Server.Controllers.Identity
{

    [Authorize]
    [Route("api/users")]
    public class UsersController : BaseApiController
    {
        private readonly IPolicyRepository _PolicyRepository;
        [Obsolete]
        public UsersController(IPolicyRepository PolicyRepository) : base(PolicyRepository)
        {
            _PolicyRepository = PolicyRepository;
        }
        // GET: api/users?_start=0&_end=10&_order=asc&_sort=Id
        [HttpGet]
        public async Task<IActionResult> Get([FromQuery] GetPagingUserParameter filter)
        {
            return await EnforcePermissionAndExecute("users", "list", async () =>
            {
                return Ok(await Mediator.Send(new GetPagingUserQuery()
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
        [HttpGet("user-ldap")]
        public async Task<IActionResult> GetUserByUserName(string username)
        {
            return Ok(await Mediator.Send(new GetUserByUserNameQuery { UserName = username }));
        }
        // GET: api/users/show/5
        [HttpGet("show/{id}")]
        public async Task<IActionResult> Show(string id)
        {
            return await EnforcePermissionAndExecute("users", "show", async () =>
            {
                return Ok(await Mediator.Send((new GetUserByIdQuery { Id = id })));
            });
        }

        // POST: api/users
        [HttpPost]
        public async Task<IActionResult> Create(CreateUserCommand command)
        {
            return await EnforcePermissionAndExecute("users", "create", async () =>
            {
                return Ok(await Mediator.Send(command));
            });
        }

        // PUT: api/users/5
        [HttpPut("{id}")]
        public async Task<IActionResult> Update(string id, UpdateUserCommand command)
        {
            return await EnforcePermissionAndExecute("users", "edit", async () =>
            {
                if (id != command.Id)
                {
                    return BadRequest();
                }
                return Ok(await Mediator.Send(command));
            });
        }


        // DELETE: api/users/delete/5
        [HttpDelete("{id}")]
        public async Task<IActionResult> Delete(string id)
        {
            return await EnforcePermissionAndExecute("users", "delete", async () =>
            {
                return Ok(await Mediator.Send(new DeleteUserByIdCommand { Id = id }));
            });
        }
    }
}
