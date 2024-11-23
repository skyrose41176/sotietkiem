using Onion.CleanArchitecture.Application.Filters;
using System.Collections.Generic;

namespace Onion.CleanArchitecture.Infrastructure.Identity
{
    public class GetPagingRoleClaimParameter : RequestParameter
    {
        public List<int> id { get; set; }
    }
}
