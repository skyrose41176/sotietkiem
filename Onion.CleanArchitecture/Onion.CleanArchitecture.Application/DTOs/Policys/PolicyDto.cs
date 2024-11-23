
namespace Onion.CleanArchitecture.Application.DTOs.Policys
{
    public class Policy
    {
        public int? Id { get; set; }
        public string Permission { get; set; } // Để lưu trữ 'p'
        public string Role { get; set; }        // Để lưu trữ 'SuperAdmin'
        public string PolicyName { get; set; }  // Để lưu trữ 'categories'
        public string Action { get; set; }      // Để lưu trữ 'delete'
    }
    public class UpdatePolicyRequest
    {

        public Policy Old { get; set; }  // Để lưu trữ 'categories'
        public Policy New { get; set; }      // Để lưu trữ 'delete'
    }

}
