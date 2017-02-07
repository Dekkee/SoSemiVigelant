using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;
using SoSemiVigelant.Provider.Entities;

namespace SoSemiVigelant.Provider
{
    public interface IPagesLoader
    {
        IEnumerable<AuctionEntry> LoadTopics();
        void LoadAuction(AuctionEntry entry);
    }
}
