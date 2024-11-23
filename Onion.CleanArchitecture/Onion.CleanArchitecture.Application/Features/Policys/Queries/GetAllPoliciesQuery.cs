
using System.Collections.Generic;
using System.Threading;
using System.Threading.Tasks;
using AutoMapper;
using MediatR;
using Onion.CleanArchitecture.Application.Interfaces.Repositories;
using Onion.CleanArchitecture.Application.Wrappers;

namespace Onion.CleanArchitecture.Application.Features.Policys.Queries
{
    public class GetAllPoliciesQuery : IRequest<Response<object>>
    {
        public int _start { get; set; }
        public int _end { get; set; }
        public string _sort { get; set; }
        public string _order { get; set; }
        public List<string> _filter { get; set; }
        public List<int> id { get; set; }
    }
    public class GetAllPoliciesQueryHandler : IRequestHandler<GetAllPoliciesQuery, Response<object>>
    {
        private readonly IPolicyRepository _chuDeRepository;
        private readonly IMapper _mapper;
        public GetAllPoliciesQueryHandler(IPolicyRepository ChuDeRepository, IMapper mapper)
        {
            _chuDeRepository = ChuDeRepository;
            _mapper = mapper;
        }

        public async Task<Response<object>> Handle(GetAllPoliciesQuery request, CancellationToken cancellationToken)
        {

            var validFilter = _mapper.Map<GetAllPoliciesParameter>(request);
            var ChuDe = await _chuDeRepository.GetAllPolicies(validFilter);
            return new Response<object>(true, new
            {
                ChuDe._start,
                ChuDe._end,
                ChuDe._total,
                ChuDe._hasNext,
                ChuDe._hasPrevious,
                ChuDe._pages,
                _data = ChuDe
            }, message: "Success");
        }
    }
}
