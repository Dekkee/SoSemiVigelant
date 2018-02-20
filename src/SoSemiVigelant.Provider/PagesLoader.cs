using System;
using System.Collections.Generic;
using System.Diagnostics;
using System.Linq;
using System.Text;
using System.Threading;
using System.Threading.Tasks;
using System.Windows;
using System.Xml.Linq;
using HtmlAgilityPack;
using Microsoft.AspNetCore.NodeServices;
using Microsoft.EntityFrameworkCore;
using SoSemiVigelant.Data.Data;
using SoSemiVigelant.Data.Entities;
using SoSemiVigelant.Provider.Entities;
using SoSemiVigelant.Provider.Utilities;

namespace SoSemiVigelant.Provider
{
    public class PagesLoader : IPagesLoader, IDisposable
    {
        private readonly WebAdapter _adapter;

        private string _login;
        private string _password;

        private readonly Timer _syncTimer;

        private readonly Dictionary<int, Data.Entities.Auction> _cachedAuctions = new Dictionary<int, Data.Entities.Auction>();
        private readonly Dictionary<string, User> _cachedUsers = new Dictionary<string, User>();

        private readonly INodeServices _nodeServices;

        public PagesLoader(INodeServices nodeServices)
        {
            _adapter = new WebAdapter();
            
            SetCredentials("dekker25@gmail.com", "67251425");
            Authorise();

            _nodeServices = nodeServices;

            _syncTimer = new Timer(SyncTopics, null, 0, (int)TimeSpan.FromMinutes(1).TotalMilliseconds);
        }
        
        private async void SyncTopics(object obj)
        {
            try
            {
                var result = await _nodeServices.InvokeAsync<Entities.Auction[]>("./bin/Parser/parser");
                
                _cachedAuctions.Clear();
                _cachedUsers.Clear();

                using (var db = new DatabaseContextFactory().Create())
                {
                    foreach (var auction in result)
                    {
                        var auc = SelectAuction(db, auction.Id);
                        auc.Name = auction.Lot;
                        auc.City = auction.City;
                        auc.Bet = auction.CurrentBid;
                        //auc.BuyOut = auction.BuyOut;
                        auc.TimeLeft = auction.Estimated.Ticks;
                        auc.TotalBets = auction.BidAmount;
                        //auc.IsFinished = auction.IsFinished;
                        auc.CurrentBet = auction.CurrentBid;

                        auc.Creator = SelectUser(db, auction.Seller);
                        //auc.Creator.OriginId = auction.CreatorId ?? 0;
                    }

                    db.SaveChanges();
                }
            }
            catch (Exception e)
            {
                Console.Error.Write($"Failed sync auctions: {e.Message}:{e.StackTrace}");
            }
        }

        private Data.Entities.Auction SelectAuction(DatabaseContext db, int auctionId)
        {
            if (!_cachedAuctions.TryGetValue(auctionId, out Data.Entities.Auction auction))
            {
                auction = db.Auctions.FirstOrDefault(_ => _.AuctionId == auctionId);
                if (auction == null)
                {
                    auction = new Data.Entities.Auction
                    {
                        AuctionId = auctionId
                    };
                    db.Auctions.Add(auction);
                }
                _cachedAuctions[auctionId] = auction;
            }

            return auction;
        }

        private User SelectUser(DatabaseContext db, Seller seller)
        {
            if (string.IsNullOrEmpty(seller.Name)) return null;

            if (!_cachedUsers.TryGetValue(seller.Name, out User user))
            {
                user = db.Users.FirstOrDefault(_ => _.Name == seller.Name);
                if (user == null)
                {
                    user = new User
                    {
                        Name = seller.Name,
                        OriginId = seller.Id
                    };
                    db.Users.Add(user);
                }
                _cachedUsers[seller.Name] = user;
            }

            return user;
        }

        public IEnumerable<AuctionEntry> LoadTopics()
        {
            List<AuctionEntry> topics = new List<AuctionEntry>();
            topics.AddRange(GetTopics(/*Settings.Url + "forum/index.php?showforum=15"*/Settings.Url + "auc/aucs.php"));
            
            return topics;
        }

        public async Task<Data.Entities.Auction> LoadAuction(int id, CancellationToken token)
        {
            var entry = new AuctionEntry { Url = $"{Settings.Url}forum/index.php?showtopic={id}" };
            await new TaskFactory().StartNew(() => { LoadAuction(entry); }, token);

            using (var db = new DatabaseContextFactory().Create())
            {
                var entity = await db.Auctions.FirstOrDefaultAsync(_ => _.AuctionId == id, token);

                entity.IsFinished = entry.IsFinished;
                entity.TimeLeft = entry.TimeLeft?.Ticks;
                entity.TotalBets = entry.TotalBets;
                entity.Step = entry.Step;

                entity.Description = entry.RawHtml;

                //var winner = SelectUser(db, entry.WinnerName);
                //if (winner != null)
                //{
                //    winner.OriginId = entry.WinnedId ?? 0;
                //    entity.WinnerBet = entry.WinnerBet;
                //}

                return entity;
            }
        }

        private void LoadAuction(AuctionEntry entry)
        {
            try
            {
                string answer = _adapter.SendGet(Helper.EscapeHtml(entry.Url));

                var doc = new HtmlDocument();
                doc.LoadHtml(answer);
                var content = doc.DocumentNode.SelectSingleNode("//*[contains(@class,'post entry-content')]");

                extractNodes(content, "//comment()");

                List<HtmlNode> nodesToRemove = new List<HtmlNode>();

                foreach (var element in content.ChildNodes)
                {
                    switch (element.Name)
                    {
                        //case "strong":
                        //    if (paragraph.Inlines.Count > 0)
                        //    {
                        //        while (paragraph.Inlines.LastInline is LineBreak)
                        //            paragraph.Inlines.Remove(paragraph.Inlines.LastInline);
                        //        document.Blocks.Add(paragraph);
                        //    }

                        //    paragraph = new Paragraph
                        //    {
                        //        LineHeight = 10
                        //    };
                        //    paragraph.Inlines.Add(new Bold(new Run(element.InnerText)));
                        //    break;
                        //case "#text":
                        //    paragraph.Inlines.Add(new Run(element.InnerText));
                        //    break;
                        //case "br":
                        //    paragraph.Inlines.Add(new LineBreak());
                        //    break;
                        //case "img":
                        //    paragraph.Inlines.Add(new Image
                        //    {
                        //        Source = new BitmapImage(new Uri(element.Attributes["src"].Value))
                        //    });
                        //    break;
                        //case "a":
                        //    var link = new Hyperlink
                        //    {
                        //        IsEnabled = true,
                        //        NavigateUri = new Uri(new Uri(Settings.Url), element.Attributes["href"].Value)
                        //    };
                        //    if (element.Attributes["class"].Value == "tooltipCard")
                        //    {
                        //        var showcard = "showcard.php?";
                        //        var address = link.NavigateUri.AbsoluteUri;
                        //        var cardName = address.Substring(address.IndexOf(showcard) + showcard.Length);

                        //        BitmapImage bitmap = GetImage(link.NavigateUri);
                        //        Image image = new Image
                        //        {
                        //            Source = bitmap
                        //        };
                        //        link.ToolTip = image;
                        //        link.NavigateUri = new Uri($"http://magiccards.info/query?q={cardName}&v=card&s=cname");
                        //    }
                        //    link.Inlines.Add(element.InnerText);
                        //    link.RequestNavigate += (sender, args) => Process.Start(args.Uri.ToString());
                        //    paragraph.Inlines.Add(link);
                        //    break;
                        case "iframe":
                            nodesToRemove.Add(element);
                            var url = element.Attributes["src"].Value;
                            var pattern = "/auc/auc.php?id=";
                            int id;
                            if (int.TryParse(url.Substring(url.IndexOf(pattern) + pattern.Length), out id))
                                entry.Id = id;
                            break;
                        default:
                            break;
                    }
                }

                foreach (var node in nodesToRemove)
                {
                    content.ChildNodes.Remove(node);
                }

                entry.RawHtml = content.InnerHtml;

                //LoadAuctionData(entry);
            }
            catch(Exception e)
            {
                Console.Error.Write($"Failed to load auction {e.Message}: {e.StackTrace}");
            }
        }

        public void LoadAuctionData(AuctionEntry entry)
        {
            try
            {
                string answer = _adapter.SendGet($"/auc/auc.php?id={entry.Id}");

                var frame = new HtmlDocument();
                frame.LoadHtml(answer);

                var form = frame.DocumentNode.SelectNodes("//form");
                //entry.IsFinished = form == null;

                var body = frame.DocumentNode.SelectNodes("//body").FirstOrDefault();
                if (body == null) return;

                var currentName = string.Empty;
                Dictionary<string, string> dictionary = new Dictionary<string, string>();
                StringBuilder sb = new StringBuilder();

                foreach (var node in body.ChildNodes)
                {
                    switch (node.Name)
                    {
                        case "input":
                        case "b":
                            //if (node.Attributes["style"] == null)
                            //{
                            if (!string.IsNullOrEmpty(currentName))
                            {
                                dictionary[currentName] = sb.ToString();
                            }
                            sb.Clear();
                            currentName = node.InnerText;
                            //}
                            //else
                            //{
                            //    sb.Append(node.InnerText);
                            //}
                            break;
                        case "#text":
                        case "span":
                            sb.Append(node.InnerText);
                            break;
                        case "br":
                            sb.AppendLine();
                            break;
                        case "a":
                            sb.Append(node.InnerText);
                            break;
                    }
                }
                if (!string.IsNullOrEmpty(currentName))
                {
                    dictionary[currentName] = sb.ToString();
                }

                //BuildAuctionEntry(dictionary, entry);
            }
            catch(Exception e)
            {
                Console.Error.Write($"Failed to load auction {e.Message}: {e.StackTrace}");
            }
}

        public void MakeBid(FormModel model)
        {
            string answer = _adapter.SubmitForm("auc/makebid.php",model);
        }

        private void BuildAuctionEntry(Dictionary<string, string> dictionary, AuctionEntry entry)
        {
            foreach (var record in dictionary)
            {
                switch (record.Key)
                {
                    case "Текущая ставка, рубли:":
                        int current;
                        string[] betString = record.Value.Split('(');
                        if (int.TryParse(betString[0], out current))
                            entry.CurrentBet = current;
                        if (betString.Length > 1)
                        {
                            var start = betString[1].IndexOf(':') + 1;
                            int yourBet;
                            if (int.TryParse(betString[1].Substring(start + 1, betString[1].IndexOf(')') - start - 1), out yourBet))
                                entry.YourBet = yourBet;
                        }
                        break;
                    case "Всего ставок:":
                        int total;
                        if (int.TryParse(record.Value, out total))
                            entry.TotalBets = total;
                        break;
                    case "До окончания аукциона:":
                        entry.TimeLeft = record.Value.Trim().ToTimeSpan();//new TimeSpan(day, hour, minute, second);
                        break;
                    case "Шаг:":
                        int step;
                        if (int.TryParse(record.Value, out step))
                            entry.Step = step;
                        break;
                    case "Победитель:":
                        entry.WinnerName = record.Value;
                        break;
                    case "Победившая ставка, рубли:":
                        int winner;
                        if (int.TryParse(record.Value, out winner))
                            entry.WinnerBet = winner;
                        break;
                }
            }
        }

        private HtmlNodeCollection extractNodes(HtmlNode document, string name)
        {
            var nodes = document.SelectNodes(name);
            if (nodes != null)
                foreach (var node in nodes)
                    node.Remove();

            return nodes;
        }

        private void SetCredentials(string login, string password)
        {
            _login = login;
            _password = password;
        }

        private void Authorise()
        {
            _adapter.SendGet("");
            
            var res = _adapter.SubmitForm("/forum/index.php?app=core&module=global&section=login&do=process", new LoginModel
            {
                username = _login,
                password = _password,
                referer = "http://topdeck.ru/forum/index.php?",
                rememberMe = "1"
            });
        }
        
        private IEnumerable<AuctionEntry> GetTopics(string link)
        {
            string answer = _adapter.SendGet(Helper.EscapeHtml(link));

            var doc = new HtmlDocument();
            doc.LoadHtml(answer);
            return doc.DocumentNode.SelectNodes("//table[@class='reftable']//tr[not(@class='header')]")
                    .Select(tr =>
                    {
                        var cells = tr.SelectNodes(".//td").ToArray();
                        var cell0A = cells[0].SelectSingleNode(".//a");
                        var cell1A = cells[1].SelectNodes(".//a").ToArray();
                        var timeLeft = cells[3].InnerText.ToTimeSpan();
                        int totalBet;
                        if (cells.Length == 7)
                        {
                            return new AuctionEntry
                            {
                                Url = cell0A.Attributes["href"].Value,
                                Name = HtmlEntity.DeEntitize(cell0A.InnerText),
                                Creator = HtmlEntity.DeEntitize(cell1A[0].InnerText),
                                CreatorUrl = new Uri(cell1A[0].Attributes["href"].Value),
                                CreatorRating = HtmlEntity.DeEntitize(cell1A[1].InnerText),
                                CreatorRatingUrl = new Uri(Settings.Url + cell1A[1].Attributes["href"].Value),
                                City = HtmlEntity.DeEntitize(cells[2].InnerText),
                                TimeLeft = timeLeft,
                                CurrentBet = int.TryParse(cells[4].InnerText, out int currentBet) ? currentBet : 0,
                                BuyOut = int.TryParse(cells[5].InnerText, out int buyOut) ? (int?)buyOut : null,
                                TotalBets = int.TryParse(cells[6].InnerText, out totalBet) ? totalBet : 0,
                                IsFinished = !timeLeft.HasValue
                            };
                        }
                        else
                        {
                            var cell3A = cells[3].SelectNodes(".//a")?.ToArray();
                            return new AuctionEntry
                            {
                                Url = cell0A.Attributes["href"].Value,
                                Name = HtmlEntity.DeEntitize(cell0A.InnerText),
                                Creator = HtmlEntity.DeEntitize(cell1A[0].InnerText),
                                CreatorUrl = new Uri(cell1A[0].Attributes["href"].Value),
                                CreatorRating = HtmlEntity.DeEntitize(cell1A[1].InnerText),
                                CreatorRatingUrl = new Uri(Settings.Url + cell1A[1].Attributes["href"].Value),
                                FinishTime = DateTime.TryParse(cells[2].InnerText, out DateTime finishTime) ? (DateTime?)finishTime : null,
                                WinnerName = cell3A?.Length == 2 ? cell3A[0].InnerText : string.Empty,
                                WinnerBet = cells[4] != null && int.TryParse(cells[4].InnerText, out int winnerBet) ? (int?)winnerBet : null,
                                TotalBets = int.TryParse(cells[5].InnerText, out totalBet) ? totalBet : 0,
                                IsFinished = true
                            };
                        }
                    });

        }
        
        public void Dispose()
        {
            _syncTimer.Dispose();
        }
    }
}

