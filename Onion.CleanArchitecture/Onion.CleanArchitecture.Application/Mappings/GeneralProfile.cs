using AutoMapper;
using Onion.CleanArchitecture.Application.DTOs.Dinhkems;
using Onion.CleanArchitecture.Application.DTOs.Email;
using Onion.CleanArchitecture.Application.Features.Emails.Commands.SendMail;
using Onion.CleanArchitecture.Application.Features.Policys.Queries;
using Onion.CleanArchitecture.Application.Features.Products.Commands.CreateProduct;
using Onion.CleanArchitecture.Application.Features.Products.Commands.UpdateProduct;
using Onion.CleanArchitecture.Application.Features.Products.Queries.GetAllProducts;
using Onion.CleanArchitecture.Application.Features.ThaoLuans.Commands.CreateThaoLuan;
using Onion.CleanArchitecture.Application.Features.ThaoLuans.Queries.GetAllThaoLuans;
using Onion.CleanArchitecture.Domain.Entities;

namespace Onion.CleanArchitecture.Application.Mappings
{
    public class GeneralProfile : Profile
    {
        public GeneralProfile()
        {
            CreateMap<Product, GetAllProductsViewModel>().ReverseMap();
            CreateMap<CreateProductCommand, Product>();
            CreateMap<UpdateProductCommand, Product>().ForAllMembers(opts => opts.Condition((src, dest, srcMember) => srcMember != null));
            CreateMap<GetAllProductsQuery, GetAllProductsParameter>();
            CreateMap<SendMailToOneEndPointCommand, SendEmailRequest>();

            #region Policy
            CreateMap<GetAllPoliciesQuery, GetAllPoliciesParameter>();
            #endregion

            #region ThaoLuan
            CreateMap<CreateThaoLuanCommand, ThaoLuan>();
            CreateMap<DinhKemThaoLuanDTO, DinhKemThaoLuan>();
            CreateMap<GetAllThaoLuansQuery, GetAllThaoLuansParameter>();
            #endregion

        }
    }
}
