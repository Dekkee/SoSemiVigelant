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
using SoSemiVigelant.Data.Data;
using SoSemiVigelant.Data.Entities;
using SoSemiVigelant.Provider.Entities;
using SoSemiVigelant.Provider.Utilities;

namespace SoSemiVigelant.Provider
{
    public class PagesLoader : IPagesLoader
    {
        private static PagesLoader _loader;

        private readonly WebAdapter _adapter;
        private HtmlDocument _doc;

        private string _login;
        private string _password;

        private Timer _syncTimer;

        public PagesLoader()
        {
            _doc = new HtmlDocument();
            _adapter = new WebAdapter();

            _syncTimer = new Timer(SyncTopics, null, 0, (int)TimeSpan.FromMinutes(1).TotalMilliseconds);
        }

        public static PagesLoader GetLoader()
        {
            if (_loader == null)
            {
                _loader = new PagesLoader();
            }
            return _loader;
        }

        private void SyncTopics(object obj)
        {
            var topics = LoadTopics();
            foreach (var topic in topics)
            {
                using (var db = new DatabaseContextFactory().Create())
                {
                    if (!db.Auctions.Any(_ => _.AuctionId == topic.Topic))
                    {
                        var auc = new Auction
                        {
                            AuctionId = topic.Topic,
                            Name = topic.Name,
                            Creator = new User
                            {
                                Name = topic.Creator,
                                OriginId = topic.CreatorId.HasValue ? topic.CreatorId.Value : 0
                            }
                        };
                        db.Auctions.Add(auc);
                    }
                }
            }
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

            _doc = new HtmlDocument();
            _doc.LoadHtml(answer);
            var content = _doc.DocumentNode.SelectNodes("//*[contains(@class,'post entry-content')]");
            _doc.LoadHtml(content.Select(_ => _.InnerHtml.Replace("\r\n", "").Replace("\n", "").Replace("\t", ""))
                    .FirstOrDefault());

            entry.RawHtml = _doc.DocumentNode.InnerHtml;

            extractNodes(_doc, "//comment()");
            
            foreach (var element in _doc.DocumentNode.ChildNodes)
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

        private HtmlNodeCollection extractNodes(HtmlDocument document, string name)
        {
            var nodes = document.DocumentNode.SelectNodes(name);
            if (nodes != null)
                foreach (var node in nodes)
                    node.Remove();

            return nodes;
        }

        public void SetCredentials(string login, string password)
        {
            _login = login;
            _password = password;
        }

        public void Authorise()
        {
            _adapter.SendGet("");
            
            if (LoadingProgressChangedEvent != null)
            {
                LoadingProgressChangedEvent(this, new LoadingProgressChangedEventArgs(0, "Authorizing"));
            }


            var res = _adapter.SubmitForm("/forum/index.php?app=core&module=global&section=login&do=process", new LoginModel
            {
                username = _login,
                password = _password,
                referer = "http://topdeck.ru/forum/index.php?",
                rememberMe = "1"
            });
        }

        public class LoadingProgressChangedEventArgs
        {
            public int Progress;
            public string Message;

            public LoadingProgressChangedEventArgs(int progress, string message = "")
            {
                Progress = progress;
                Message = message;
            }
        }
        
        public delegate void LoadingProgressChangedEventHandler(object sender, LoadingProgressChangedEventArgs ev);

        public event LoadingProgressChangedEventHandler LoadingProgressChangedEvent;
        
        private string GetNextPageLink()
        {
            string nextPageLink = null;
            var nextPageElement = _doc.DocumentNode.SelectNodes("//li").FirstOrDefault(d => d.Attributes.Contains("class") && d.Attributes["class"].Value.Contains("next"));
            if (nextPageElement != null)
            {
                nextPageLink = nextPageElement.ChildNodes.FirstOrDefault().Attributes["href"].Value;
            }
            return nextPageLink;
        }

        private IEnumerable<AuctionEntry> GetTopics(string link)
        {
            string answer = _adapter.SendGet(Helper.EscapeHtml(link));

            _doc = new HtmlDocument();
            _doc.LoadHtml(answer);
            return _doc.DocumentNode.SelectNodes("//table[@class='reftable']//tr[not(@class='header')]")
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

        //private BitmapImage GetImage(Uri uri)
        //{
        //    string answer = _adapter.SendGet(uri.AbsoluteUri);

        //    _doc = new HtmlDocument();
        //    _doc.LoadHtml(answer);
        //    var address = _doc.DocumentNode.SelectNodes("//img").Select(_ => _.Attributes["src"].Value).FirstOrDefault();

        //    return string.IsNullOrEmpty(address) 
        //        ? null
        //        : new BitmapImage(new Uri(Settings.BaseUri, address));
        //}

        private int GetTotalPages()
        {
            string totalPagesString = "0";
            var nextPageElement = _doc.DocumentNode.SelectNodes("//li").FirstOrDefault(d => d.Attributes.Contains("class") && d.Attributes["class"].Value.Contains("last"));
            var pattern = "&amp;st=";
            if (nextPageElement != null)
            {
                totalPagesString = nextPageElement.ChildNodes.FirstOrDefault().Attributes["href"].Value;
                totalPagesString = totalPagesString.Substring(totalPagesString.IndexOf(pattern) + pattern.Length);
            }
            return int.Parse(totalPagesString);
        }
    }
}

