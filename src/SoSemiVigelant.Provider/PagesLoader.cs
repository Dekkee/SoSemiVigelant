﻿using System;
using System.Collections.Generic;
using System.Diagnostics;
using System.Linq;
using System.Text;
using System.Threading;
using System.Threading.Tasks;
using System.Windows;
using System.Xml.Linq;
using HtmlAgilityPack;
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

        private readonly Dictionary<int, Auction> _cachedAuctions = new Dictionary<int, Auction>();
        private readonly Dictionary<string, User> _cachedUsers = new Dictionary<string, User>();

        public PagesLoader()
        {
            _adapter = new WebAdapter();
            
            SetCredentials("dekker25@gmail.com", "67251425");
            Authorise();

            _syncTimer = new Timer(SyncTopics, null, 0, (int)TimeSpan.FromMinutes(1).TotalMilliseconds);
        }
        
        private void SyncTopics(object obj)
        {
            var topics = LoadTopics();
            
            using (var db = new DatabaseContextFactory().Create())
            {
                foreach (var topic in topics)
                {
                    if (!topic.Topic.HasValue) continue;

                    var auc = SelectAuction(db, topic.Topic.Value);
                    auc.Name = topic.Name;
                    auc.City = topic.City;
                    auc.Bet = topic.Bet;
                    auc.BuyOut = topic.BuyOut;
                    //auc.TimeLeft = topic.TimeLeft;
                    auc.TotalBets = topic.TotalBets;
                    
                    auc.Creator = SelectUser(db, topic.Creator);
                    auc.Creator.OriginId = topic.CreatorId ?? 0;
                }

                db.SaveChanges();
            }
        }

        private Auction SelectAuction(DatabaseContext db, int auctionId)
        {
            Auction auction;
            if (!_cachedAuctions.TryGetValue(auctionId, out auction))
            {
                auction = db.Auctions.FirstOrDefault(_ => _.AuctionId == auctionId);
                if (auction == null)
                {
                    auction = new Auction
                    {
                        AuctionId = auctionId
                    };
                    db.Auctions.Add(auction);
                }
                _cachedAuctions[auctionId] = auction;
            }

            return auction;
        }

        private User SelectUser(DatabaseContext db, string name)
        {
            User user;
            if (!_cachedUsers.TryGetValue(name, out user))
            {
                user = db.Users.FirstOrDefault(_ => _.Name == name);
                if (user == null)
                {
                    user = new User
                    {
                        Name = name
                    };
                    db.Users.Add(user);
                }
                _cachedUsers[name] = user;
            }

            return user;
        }

        public IEnumerable<AuctionEntry> LoadTopics()
        {
            List<AuctionEntry> topics = new List<AuctionEntry>();
            topics.AddRange(GetTopics(/*Settings.Url + "forum/index.php?showforum=15"*/Settings.Url + "auc/aucs.php"));
            
            return topics;
        }

        public void LoadAuction(AuctionEntry entry)
        {
            string answer = _adapter.SendGet(Helper.EscapeHtml(entry.Url));

            var doc = new HtmlDocument();
            doc.LoadHtml(answer);
            var content = doc.DocumentNode.SelectSingleNode("//*[contains(@class,'post entry-content')]");
            
            entry.RawHtml = content.InnerHtml;

            extractNodes(content, "//comment()");
            
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
            
            LoadAuctionData(entry);
            
        }

        public void LoadAuctionData(AuctionEntry entry)
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
            
            BuildAuctionEntry(dictionary, entry);
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
                        int totalBet;
                        if (cells.Length == 7)
                        {
                            int currentBet;
                            int buyOut;
                            return new AuctionEntry
                            {
                                Url = cell0A.Attributes["href"].Value,
                                Name = cell0A.InnerText,
                                Creator = cell1A[0].InnerText,
                                CreatorUrl = new Uri(cell1A[0].Attributes["href"].Value),
                                CreatorRating = cell1A[1].InnerText,
                                CreatorRatingUrl = new Uri(Settings.Url + cell1A[1].Attributes["href"].Value),
                                City = cells[2].InnerText,
                                TimeLeft = cells[3].InnerText.ToTimeSpan(),
                                CurrentBet = int.TryParse(cells[4].InnerText, out currentBet) ? currentBet : 0,
                                BuyOut = int.TryParse(cells[5].InnerText, out buyOut) ? (int?) buyOut : null,
                                TotalBets = int.TryParse(cells[6].InnerText, out totalBet) ? totalBet : 0,
                                IsFinished = false
                            };
                        }
                        else
                        {
                            var cell3A = cells[3].SelectNodes(".//a")?.ToArray();
                            DateTime finishTime;
                            int winnerBet;
                            return new AuctionEntry
                            {
                                Url = cell0A.Attributes["href"].Value,
                                Name = cell0A.InnerText,
                                Creator = cell1A[0].InnerText,
                                CreatorUrl = new Uri(cell1A[0].Attributes["href"].Value),
                                CreatorRating = cell1A[1].InnerText,
                                CreatorRatingUrl = new Uri(Settings.Url + cell1A[1].Attributes["href"].Value),
                                FinishTime = DateTime.TryParse(cells[2].InnerText, out finishTime) ? (DateTime?)finishTime : null,
                                WinnerName = cell3A?.Length == 2 ? cell3A[0].InnerText : string.Empty,
                                WinnerBet = cells[4] != null && int.TryParse(cells[4].InnerText, out winnerBet) ? (int?)winnerBet : null,
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

