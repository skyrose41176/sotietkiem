using System.Collections.Generic;
using System.Threading.Tasks;
using Casbin;
using Onion.CleanArchitecture.Application.DTOs.Policys;
using Onion.CleanArchitecture.Application.Features.Policys.Queries;
using Onion.CleanArchitecture.Application.Wrappers;

namespace Onion.CleanArchitecture.Application.Interfaces.Repositories
{
    public interface IPolicyRepository
    {
        Task<PagedList<Policy>> GetAllPolicies(GetAllPoliciesParameter parameter);
        Task AddPolicyAsync(Policy newPolicy);
        Enforcer GetEnforcer();
        string GetFilePath();
        // Task UpdatePolicyAsync(UpdatePolicyRequest updatedPolicy);
        // Task DeletePolicyAsync(string permission, string role, string policyName, string action);
    }
}
