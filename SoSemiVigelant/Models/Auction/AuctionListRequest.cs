using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;
using SoSemiVigelant.Core.Models;

namespace SoSemiVigelant.Models.Auction
{
    public class AuctionListRequest : ListRequest
    {
        /// <summary>
        /// Сортировка
        /// </summary>
        public AuctionListOrder? Order { get; set; }

        /// <summary>
        /// Направление сортировки
        /// </summary>
        public bool Asc { get; set; } = true;

        /// <summary>
        /// Показывать только активные
        /// </summary>
        public bool OnlyActive { get; set; } = true;

        /// <summary>
        /// фильтр по имени
        /// </summary>
        public string Name { get; set; }
    }
}
