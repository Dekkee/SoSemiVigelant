using Newtonsoft.Json;
using System;
using System.Collections.Generic;
using System.Text;

namespace SoSemiVigelant.Provider.Entities
{
    class Auction
    {
        [JsonProperty("id")]
        public int Id { get; set; }

        [JsonProperty("lot")]
        public string Lot { get; set; }

        [JsonProperty("date_estimated")]
        private long estimated;
        public DateTime Estimated { get
            {
                return new DateTime(estimated);
            }
            set
            {
                estimated = value.Ticks;
            }
        }

        [JsonProperty("image")]
        public string ImageName { get; set; }

        [JsonProperty("start_bid")]
        public int StartBin { get; set; }

        [JsonProperty("current_bid")]
        public int CurrentBid { get; set; }

        [JsonProperty("bid_amount")]
        public int BidAmount { get; set; }

        [JsonProperty("shipping_info_quick")]
        public string ShippingInfoShort { get; set; }

        [JsonProperty("shipping_info")]
        public string ShippingInfo { get; set; }

        [JsonProperty("bin_value")]
        public int BinValue { get; set; }

        [JsonProperty("date_published")]
        private long published;
        public DateTime Published
        {
            get
            {
                return new DateTime(published);
            }
            set
            {
                published = value.Ticks;
            }
        }

        [JsonProperty("thumb_is_generic")]
        public bool ThumbIsGeneric { get; set; }

        [JsonProperty("with_post")]
        public bool WithPost { get; set; }

        [JsonProperty("city")]
        public string City { get; set; }

        [JsonProperty("seller_ip")]
        public string SellerIp { get; set; }

        [JsonProperty("seller")]
        public Seller Seller { get; set; }
    }
}
