using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using Onion.CleanArchitecture.Application.Features.Emails.Commands.SendMail;
using Onion.CleanArchitecture.Application.Interfaces.Repositories;

namespace Onion.CleanArchitecture.WebApp.Server.Controllers
{
    [Authorize]
    [Route("api/Email")]
    public class EmailController : BaseApiController
    {
        private readonly IPolicyRepository _PolicyRepository;
        [Obsolete]
        public EmailController(
           IPolicyRepository PolicyRepository) : base(PolicyRepository)
        {
            _PolicyRepository = PolicyRepository;
        }
        /// <summary>
        /// Post send Email
        /// </summary>
        /// <param name="command"></param>
        /// <returns></returns>
        /// <remarks>
        /// Sample request:
        ///
        ///     POST /api/v1/Email/send-mail
        ///     {
        ///        "emailTo": "A",
        ///        "emailCc": 1,
        ///        "tenTTKD": 1,
        ///        "diem": 1
        ///     }
        ///
        /// </remarks>
        /// 
        [HttpPost()]
        // [AllowAnonymous]
        public async Task<IActionResult> Create(SendMailToOneEndPointCommand command)
        {
            return Ok(await Mediator.Send(command));
        }
    }
}
