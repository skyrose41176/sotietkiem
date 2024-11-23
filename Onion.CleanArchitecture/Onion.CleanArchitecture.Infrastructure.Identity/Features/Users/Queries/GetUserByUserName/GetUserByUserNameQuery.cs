using System;
using System.Threading;
using System.Threading.Tasks;
using MediatR;
using Microsoft.Extensions.Options;
using Onion.CleanArchitecture.Infrastructure.Identity.Helpers;
using Onion.CleanArchitecture.Application.Wrappers;
using Onion.CleanArchitecture.Application.Exceptions;
using Onion.CleanArchitecture.Application.Helpers;

namespace Onion.CleanArchitecture.Infrastructure.Identity;

public class GetUserByUserNameQuery : IRequest<Response<LdapInfo>>
{
    public string UserName { get; set; }
    public class GetUserByUserNameQueryHandler : IRequestHandler<GetUserByUserNameQuery, Response<LdapInfo>>
    {
        private readonly ILdapAuthenHelper _ldapAuthenHelper;
        private readonly LdapConfig _ldapConfig;

        public GetUserByUserNameQueryHandler(ILdapAuthenHelper ldapAuthenHelper, IOptions<LdapConfig> ldapConfig)
        {
            _ldapAuthenHelper = ldapAuthenHelper;
            _ldapConfig = ldapConfig.Value;
        }

        public async Task<Response<LdapInfo>> Handle(GetUserByUserNameQuery query, CancellationToken cancellationToken)
        {
            var rs = _ldapAuthenHelper.AuthenInfoMail(query.UserName, _ldapConfig);
            await Task.CompletedTask;
            if (rs == null) throw new ApiException($"Không tìm thấy người dùng");
            return new Response<LdapInfo>(rs);
        }
    }
}
