using Newtonsoft.Json;
using System;
using System.Collections.Generic;
using System.Text;

namespace SoSemiVigelant.Provider.Entities
{
    class Seller
    {
        [JsonProperty("id")]
        public int Id { get; set; }

        [JsonProperty("name")]
        public string Name { get; set; }

        [JsonProperty("city")]
        public string City { get; set; }

        [JsonProperty("refs")]
        public int Refs { get; set; }
    }
}
