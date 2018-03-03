using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading;
using System.Threading.Tasks;
using Microsoft.EntityFrameworkCore;
using SoSemiVigelant.Data.Data;
using SoSemiVigelant.Core.Extensions;

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
            return new AuctionModel
            {
                Id = auction.AuctionId ?? 0,
                Name = auction.Name,
                //TimeLeft = auction.TimeLeft.HasValue ? (TimeSpan?)TimeSpan.FromTicks(auction.TimeLeft.Value) : null,
                TimeLeft = auction.TimeLeft,
                CurrentBet = auction.CurrentBet
            };
        }

        public static AuctionModel Map(Data.Entities.Auction auction)
        {
            var entity = Create(auction);
            entity.Description = auction.Description;
            return entity;
        }

        #region Properties

        public int Id { get; set; }
        public string Name { get; set; }
        public long? TimeLeft { get; set; }
        public int CurrentBet { get; set; }
        public string Description { get; set; }
        #endregion

    }
}
