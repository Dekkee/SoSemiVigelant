using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading;
using System.Threading.Tasks;
using Microsoft.EntityFrameworkCore;
using SoSemiVigelant.Data.Data;

namespace SoSemiVigelant.Models.User
{
    public class UserModel
    {
        public static async Task<UserModel> Create(DatabaseContext db, int id, CancellationToken token)
        {
            var auc = await db.Users.FirstOrDefaultAsync(_ => _.OriginId == id, token);

            if (auc == null)
            {
                //TODO: Залогировать
                return null;
            }

            return Create(auc);
        }

        public static UserModel Create(Data.Entities.User auction)
        {
            var model = new UserModel
            {
                Name = auction.Name
            };
            return model;
        }

        public static UserModel Map(Data.Entities.User auction)
        {
            return new UserModel
            {
                Id = auction.OriginId,
                Name = auction.Name
            };
        }

        #region Properties

        public int Id { get; set; }
        public string Name { get; set; }

        #endregion

    }
}
