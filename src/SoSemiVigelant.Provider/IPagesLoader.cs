using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading;
using System.Threading.Tasks;
using SoSemiVigelant.Data.Entities;
using SoSemiVigelant.Provider.Entities;

namespace SoSemiVigelant.Provider
{
    public interface IPagesLoader
    {
        IEnumerable<AuctionEntry> LoadTopics();
        Task<Data.Entities.Auction> LoadAuction(int id, CancellationToken token);
    }
}
