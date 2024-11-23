namespace Onion.CleanArchitecture.Domain.DTOs
{
    public class ModelDTO
    {
        public string Content { get; set; }
        public string Default()
        {
            return @"
            [request_definition]
            r = sub, obj, act

            [policy_definition]
            p = sub, obj, act

            [policy_effect]
            e = some(where (p.eft == allow))

            [matchers]
            m = r.sub == p.sub && r.obj == p.obj && r.act == p.act
            ";
        }
    }
}
