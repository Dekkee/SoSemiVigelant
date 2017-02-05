using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;
using Microsoft.AspNetCore.Mvc;
using SoSemiVigelant.Data.Data;
using SoSemiVigelant.Data.Entities;
using SoSemiVigelant.Models;
using SoSemiVigelant.Provider;
using SoSemiVigelant.Provider.Entities;

namespace SoSemiVigelant.Controllers
{
    //[Route("api/[controller]")]
    public class ValuesController : Controller
    {
        public ValuesController(IPagesLoader loader)
        {
            PagesLoader = loader;

            PagesLoader.SetCredentials("dekker25@gmail.com", "67251425");
            PagesLoader.Authorise();
        }

        public IPagesLoader PagesLoader { get; set; }
        // GET api/values
        [HttpGet]
        [Route("Aucs/List")]
        public IEnumerable<AuctionEntry> Get()
        {
            //using (var db = new DatabaseContextFactory().Create())
            //{
            //    var aucs = db.Set<Auction>();
            //    return aucs;
            //}

            return PagesLoader.LoadTopics();
        }
        
        // GET api/values/5
        [HttpGet("{id}")]
        [Route("Aucs/Get/{id}")]
        public string Get(int id)
        {
            var entry = new AuctionEntry {Url = $"{Settings.Url}forum/index.php?showtopic={id}"};

            PagesLoader.LoadAuction(entry);
            return entry.RawHtml;
        }
    }
}
