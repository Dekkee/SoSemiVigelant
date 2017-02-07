using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading;
using System.Threading.Tasks;
using Microsoft.EntityFrameworkCore;
using SoSemiVigelant.Data.Data;

namespace SoSemiVigelant.Models.Auction
{
    public class AuctionModel
    {
        public static async Task<AuctionModel> Create(DatabaseContext db, int id, CancellationToken token)
        {
            var auc = await db.Auctions.FirstOrDefaultAsync(_ => _.AuctionId == id, token);

            if (auc == null)
            {
                //TODO: Залогировать
                return null;
            }

            return Create(auc);
        }

        public static AuctionModel Create(Data.Entities.Auction auction)
        {
            var model = new AuctionModel
            {
                Id = auction.AuctionId ?? 0,
                Name = auction.Name
            };
            return model;
        }

        public static AuctionModel Map(Data.Entities.Auction auction)
        {
            return new AuctionModel
            {
                Id = auction.AuctionId ?? 0,
                Name = auction.Name
            };
        }

        #region Properties

        public int Id { get; set; }
        public string Name { get; set; }

        #endregion

    }
}
