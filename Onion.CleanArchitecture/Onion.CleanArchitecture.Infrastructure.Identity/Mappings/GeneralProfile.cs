using AutoMapper;
using Onion.CleanArchitecture.Infrastructure.Identity.Features.Users.Queries.GetPagingUser;
using Onion.CleanArchitecture.Infrastructure.Identity.Features.Users.Queries.GetUserById;
using Onion.CleanArchitecture.Infrastructure.Identity.Models;

namespace Onion.CleanArchitecture.Infrastructure.Identity.Mappings;

public class GeneralProfile : Profile
{
    public GeneralProfile()
    {
        CreateMap<ApplicationUser, GetPagingUserViewModel>().ReverseMap();
        CreateMap<ApplicationUser, GetUserByIdModel>().ReverseMap();
        CreateMap<ApplicationUser, UpdateUserCommand>().ReverseMap().ForAllMembers(opts => opts.Condition((src, dest, srcMember) => srcMember != null));

    }
}
