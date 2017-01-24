using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;
using SoSemiVigelant.Models;

namespace SoSemiVigelant
{
    public interface IPagesLoader
    {
        void SetCredentials(string login, string password);
        void Authorise();
        IEnumerable<AuctionEntry> LoadTopics();
        void LoadAuction(AuctionEntry entry);
    }
}
