using System;
using System.Collections.Generic;
using System.Threading;
using System.Threading.Tasks;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using SoSemiVigelant.Core.Models;
using SoSemiVigelant.Data.Data;
using SoSemiVigelant.Data.Entities;
using SoSemiVigelant.Models.Auction;
using SoSemiVigelant.Provider;
using SoSemiVigelant.Provider.Entities;
using FromServicesAttribute = SoSemiVigelant.Core.Extensions.PropertyFromServicesAttribute;

namespace SoSemiVigelant.Controllers
{
    public class AuctionsController : Controller
    {
        public AuctionsController()
        {
        }

        [FromServices]
        public IPagesLoader PagesLoader { get; set; }
        
        [FromServices]
        public DatabaseContext DbContext { get; set; }

        [FromServices]
        public IListFactory<AuctionModel, AuctionListRequest> ListFactory { get; set; }
        
        [HttpGet("~/auctions")]
        public async Task<GenericListResponse<AuctionModel>> List([FromQuery]AuctionListRequest request, CancellationToken token)
        {
            return await ListFactory.Create(DbContext, request, token);
        }
        
        [HttpGet("~/auctions/{id}")]
        public async Task<BaseResponse<AuctionModel>> Get([FromQuery]int id, CancellationToken token)
        {
            var auc = AuctionModel.Map(await PagesLoader.LoadAuction(id, token));
            return new BaseResponse<AuctionModel>(auc);
        }
    }
}
