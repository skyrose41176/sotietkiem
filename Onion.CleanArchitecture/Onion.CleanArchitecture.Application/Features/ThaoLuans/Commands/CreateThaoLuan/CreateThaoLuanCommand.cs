
using System.Collections.Generic;
using System.Threading;
using System.Threading.Tasks;
using AutoMapper;
using MediatR;
using Onion.CleanArchitecture.Application.Wrappers;
using Onion.CleanArchitecture.Domain.Entities;
using Onion.CleanArchitecture.Application.Interfaces.Repositories;
using Onion.CleanArchitecture.Application.Interfaces;
using Onion.CleanArchitecture.Application.Exceptions;
using Onion.CleanArchitecture.Application.DTOs.Dinhkems;

namespace Onion.CleanArchitecture.Application.Features.ThaoLuans.Commands.CreateThaoLuan
{
    public partial class CreateThaoLuanCommand : IRequest<Response<int>>
    {
        public int? ProductId { get; set; }
        public string NoiDung { get; set; }
        public int? ParentId { get; set; }
        public ICollection<DinhKemThaoLuanDTO>? DinhKemThaoLuans { get; set; }
        public List<string> Emails { get; set; }
    }
    public class CreateThaoLuanCommandHandler : IRequestHandler<CreateThaoLuanCommand, Response<int>>
    {
        private readonly IMapper _mapper;
        private readonly IEmailRepositoryAsync _emailRepository;
        private readonly IThaoLuanRepositoryAsync _thaoLuanRepository;
        private readonly IAuthenticatedUserService _authenticatedUser;
        private readonly IProductRepositoryAsync _productRepository;
        public CreateThaoLuanCommandHandler(IMapper mapper,
                                            IEmailRepositoryAsync emailRepository,  
                                            IThaoLuanRepositoryAsync thaoLuanRepository,
                                            IAuthenticatedUserService authenticatedUser,
                                            IProductRepositoryAsync productRepository)
        {
            _mapper = mapper;
            _emailRepository = emailRepository;
            _authenticatedUser = authenticatedUser;
            _thaoLuanRepository = thaoLuanRepository;
            _productRepository = productRepository;
        }
        public async Task<Response<int>> Handle(CreateThaoLuanCommand request, CancellationToken cancellationToken)
        {
            var thaoLuan = _mapper.Map<ThaoLuan>(request);

            if (request.ProductId != null && request.ProductId != 0)
            {
                var product = await _productRepository.GetByIdAsync(thaoLuan.ProductId ?? 0);
                if (product == null) 
                    throw new ApiException("Không tìm thấy yêu cầu này!");
            }


            thaoLuan.UserId = _authenticatedUser.UserId;
            await _thaoLuanRepository.AddAsync(thaoLuan);

            if(request.ProductId  != null && request.ProductId != 0)
            {
                if (request.ParentId != null && request.ParentId != 0)
                {
                    var countChildren = await _thaoLuanRepository.CountThaoLuanProductId(request.ProductId ?? 0, request.ParentId.Value);
                    var parent = await _thaoLuanRepository.GetByIdAsync(request.ParentId.Value);
                    parent.SoLuongPhanHoi = countChildren;
                    await _thaoLuanRepository.UpdateAsync(parent);
                }
            }
            return new Response<int>(thaoLuan.Id);
        }
    }
}