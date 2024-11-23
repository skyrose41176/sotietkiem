using CsvHelper.Configuration;
using Onion.CleanArchitecture.Application.DTOs.Policys;


public class PolicyMap : ClassMap<Policy>
{
    public PolicyMap()
    {
        Map(m => m.Permission).Index(0);
        Map(m => m.Role).Index(1);
        Map(m => m.PolicyName).Index(2);
        Map(m => m.Action).Index(3);
    }
}
