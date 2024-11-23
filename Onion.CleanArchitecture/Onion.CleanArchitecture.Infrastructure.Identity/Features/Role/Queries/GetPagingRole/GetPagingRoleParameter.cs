using Onion.CleanArchitecture.Application.Filters;
using System.Collections.Generic;

namespace Onion.CleanArchitecture.Infrastructure.Identity.Features.Role.Queries.GetPagingRole
{
    public class GetPagingRoleParameter : RequestParameter
    {
        public List<string> id { get; set; }
    }
}
