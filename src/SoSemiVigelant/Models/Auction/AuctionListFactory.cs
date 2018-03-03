using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;
using Microsoft.EntityFrameworkCore.Storage;
using SoSemiVigelant.Core.Models;
using SoSemiVigelant.Data.Data;
using AuctionEntity = SoSemiVigelant.Data.Entities.Auction;

namespace SoSemiVigelant.Models.Auction
{
    public class AuctionListFactory : AbstractListFactory<AuctionEntity, AuctionModel, AuctionListRequest>
    {
        protected override IOrderedQueryable<AuctionEntity> BasicQuery(DatabaseContext db, AuctionListRequest request)
        {
            var auctions = db.Auctions.AsQueryable();

            auctions = Filteration(auctions, request);
            auctions = OrderBy(auctions, request.Order, request.Asc);

            return (IOrderedQueryable<AuctionEntity>)auctions;
        }

        /// <summary>
        /// Фильтрация
        /// </summary>
        /// <param name="auctions"></param>
        /// <param name="request"></param>
        /// <returns></returns>
        private IQueryable<AuctionEntity> Filteration(IQueryable<AuctionEntity> auctions, AuctionListRequest request)
        {
            auctions = request.OnlyActive
                ? auctions.Where(_ => !_.IsFinished)
                : auctions;

            auctions = string.IsNullOrEmpty(request.Name)
                ? auctions
                : auctions.Where(_ => _.Name.IndexOf(request.Name, StringComparison.CurrentCultureIgnoreCase) >= 0);

            return auctions;
        }

        /// <summary>
        /// Сортировка по <see cref="AuctionListOrder"/>
        /// </summary>
        /// <param name="order"></param>
        /// <param name="asc">направление</param>
        /// <returns></returns>
        private IOrderedQueryable<AuctionEntity> OrderBy(IQueryable<AuctionEntity> auctions, AuctionListOrder? order = null, bool asc = true)
        {
            if (order == null)
            {
                // сортировка по умолчанию
                return auctions.OrderBy(_ => _.TimeLeft);
            }

            switch (order.Value)
            {
                case AuctionListOrder.Name:
                    return asc ? auctions.OrderBy(_ => _.Name) : auctions.OrderByDescending(_ => _.Name);
                case AuctionListOrder.TimeLeft:
                    return asc ? auctions.OrderBy(_ => _.TimeLeft) : auctions.OrderByDescending(_ => _.TimeLeft);
                case AuctionListOrder.CurrentBet:
                    return asc ? auctions.OrderBy(_ => _.CurrentBet) : auctions.OrderByDescending(_ => _.CurrentBet);
                default:
                    return asc ? auctions.OrderBy(_ => _.TimeLeft) : auctions.OrderByDescending(_ => _.TimeLeft);
            }
        }

        protected override AuctionModel Map(AuctionEntity entity)
        {
            return AuctionModel.Create(entity);
        }
    }
}
