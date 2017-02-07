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
            var user = await db.Users.FirstOrDefaultAsync(_ => _.OriginId == id, token);

            if (user == null)
            {
                //TODO: Залогировать
                return null;
            }

            return Create(user);
        }

        public static UserModel Create(Data.Entities.User user)
        {
            var model = new UserModel
            {
                Id = user.OriginId,
                Name = user.Name
            };
            return model;
        }

        public static UserModel Map(Data.Entities.User user)
        {
            return new UserModel
            {
                Id = user.OriginId,
                Name = user.Name
            };
        }

        #region Properties

        public int Id { get; set; }
        public string Name { get; set; }

        #endregion

    }
}
