using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;
using Microsoft.AspNetCore.Mvc;
using SoSemiVigelant.Models;

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
            
            return PagesLoader.LoadTopics();
        }
        
        // GET api/values/5
        [HttpGet("{id}")]
        [Route("Aucs/Get/{id}")]
        public string Get(int id)
        {
            var entry = new AuctionEntry();
            entry.Url = $"{Settings.Url}forum/index.php?showtopic={id}";

            PagesLoader.LoadAuction(entry);
            return entry.RawHtml;
        }

        // POST api/values
        [HttpPost]
        public void Post([FromBody]string value)
        {
        }

        // PUT api/values/5
        [HttpPut("{id}")]
        public void Put(int id, [FromBody]string value)
        {
        }

        // DELETE api/values/5
        [HttpDelete("{id}")]
        public void Delete(int id)
        {
        }

        [HttpPost]
        public void SetCredentials([FromBody]string username, [FromBody]string password)
        {
            PagesLoader.SetCredentials(username, password);
        }

        [HttpGet(Name = "Auth")]
        public string Auth()
        {
            PagesLoader.SetCredentials("dekker25@gmail.com", "67251425");
            PagesLoader.Authorise();

            return "Gut";
        }
    }
}
