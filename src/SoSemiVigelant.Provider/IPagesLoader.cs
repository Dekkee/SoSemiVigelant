using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;
using SoSemiVigelant.Provider.Entities;

namespace SoSemiVigelant.Provider
{
    public interface IPagesLoader
    {
        void SetCredentials(string login, string password);
        void Authorise();
        IEnumerable<AuctionEntry> LoadTopics();
        void LoadAuction(AuctionEntry entry);
    }
}
