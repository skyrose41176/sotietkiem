using System.Collections.Generic;

namespace Onion.CleanArchitecture.Domain.DTOs
{
    public class PolicyDTO
    {
        public string Permit { get; set; }
        public string Role { get; set; }
        public string Key { get; set; }
        public string Value { get; set; }
        public List<PolicyDTO> Default()
        {
            var permits = new[] { "p" };
            var roles = new[] { "SuperAdmin" };
            var keys = new[] { "roleclaims", "roles", "users" };
            var values = new[] { "list", "create", "show", "edit", "delete" };

            var policies = new List<PolicyDTO>();

            foreach (var permit in permits)
            {
                foreach (var role in roles)
                {
                    foreach (var key in keys)
                    {
                        foreach (var value in values)
                        {
                            policies.Add(new PolicyDTO
                            {
                                Permit = permit,
                                Role = role,
                                Key = key,
                                Value = value
                            });
                        }
                    }
                }
            }

            return policies;
        }
    }
}
