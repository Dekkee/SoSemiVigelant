using System;
using System.Collections.Generic;
using System.Threading;
using System.Threading.Tasks;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using SoSemiVigelant.Core.Extensions;
using SoSemiVigelant.Core.Models;
using SoSemiVigelant.Data.Data;
using SoSemiVigelant.Models.Auction;
using SoSemiVigelant.Models.User;
using SoSemiVigelant.Provider;
using SoSemiVigelant.Provider.Entities;
using FromServicesAttribute = SoSemiVigelant.Core.Extensions.PropertyFromServicesAttribute;

namespace SoSemiVigelant.Controllers
{
    public class UsersController : Controller
    {
        public UsersController()
        {
        }
        
        [FromServices]
        public IListFactory<UserModel, UserListRequest> ListFactory { get; set; }

        [FromServices]
        public DatabaseContext DbContext { get; set; }

        // GET api/values
        [HttpGet]
        public async Task<GenericListResponse<UserModel>> List([FromQuery]UserListRequest request, CancellationToken token)
        {
            return await ListFactory.Create(DbContext, request, token);
        }
        
        // GET api/values/5
        [HttpGet("{id}")]
        public async Task<BaseResponse<UserModel>> Get([FromQuery]int id, CancellationToken token)
        {
            var auc = await DbContext.Users.FirstOrDefaultAsync(_ => _.OriginId == id, token);
            var model = UserModel.Map(auc);
            return new BaseResponse<UserModel>(model);
        }
    }
}
