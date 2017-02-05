using System;
using System.Collections.Generic;
using System.ComponentModel;
using System.Linq;
using System.Text;
using System.Threading.Tasks;
using System.Windows;
using System.Windows.Input;
using SoSemiVigelant.Provider.Utilities;

namespace SoSemiVigelant.Provider.Entities
{
    public class AuctionEntry : INotifyPropertyChanged
    {
        public AuctionEntry()
        {
        }

        public event PropertyChangedEventHandler PropertyChanged;
        
        public string Name { get; set; }
        public string Creator { get; set; }
        public Uri CreatorUrl { get; set; }
        public string CreatorRating { get; set; }
        public Uri CreatorRatingUrl { get; set; }
        public string City { get; set; }
        public string Url { get; set; }
        public int Id { get; set; }
        public int? Bid { get; set; }
        public bool IsFinished { get; set; }

        private int _currentBet;
        private int _yourBet;
        private int _totalBets;
        private int _step;
        private int? _buyOut;
        private TimeSpan? _timeLeft;
        private DateTime? _finishTime;

        public int Bet => IsFinished && WinnerBet != null ? WinnerBet.Value : CurrentBet;
        public int CurrentBet
        {
            get { return _currentBet; }
            set
            {
                if (_currentBet != value)
                {
                    _currentBet = value;

                    if (PropertyChanged != null)
                    {
                        PropertyChanged(this,
                            new PropertyChangedEventArgs("CurrentBet"));
                    }
                }
            }
        }
        public int YourBet
        {
            get { return _yourBet; }
            set
            {
                if (_yourBet != value)
                {
                    _yourBet = value;

                    if (PropertyChanged != null)
                    {
                        PropertyChanged(this,
                            new PropertyChangedEventArgs("YourBet"));
                    }
                }
            }
        }
        public int TotalBets
        {
            get { return _totalBets; }
            set
            {
                if (_totalBets != value)
                {
                    _totalBets = value;

                    if (PropertyChanged != null)
                    {
                        PropertyChanged(this,
                            new PropertyChangedEventArgs("TotalBets"));
                    }
                }
            }
        }
        public int Step
        {
            get { return _step; }
            set
            {
                if (_step != value)
                {
                    _step = value;

                    if (PropertyChanged != null)
                    {
                        PropertyChanged(this,
                            new PropertyChangedEventArgs("Step"));
                    }
                }
            }
        }
        public int? BuyOut
        {
            get { return _buyOut; }
            set
            {
                if (_buyOut != value)
                {
                    _buyOut = value;

                    if (PropertyChanged != null)
                    {
                        PropertyChanged(this,
                            new PropertyChangedEventArgs("BuyOut"));
                    }
                }
            }
        }
        public TimeSpan? TimeLeft
        {
            get { return _timeLeft; }
            set
            {
                if (_timeLeft != value)
                {
                    _timeLeft = value;

                    if (PropertyChanged != null)
                    {
                        PropertyChanged(this,
                            new PropertyChangedEventArgs("TimeLeft"));
                    }
                }
            }
        }
        public DateTime? FinishTime
        {
            get { return _finishTime; }
            set
            {
                if (_finishTime != value)
                {
                    _finishTime = value;

                    if (PropertyChanged != null)
                    {
                        PropertyChanged(this,
                            new PropertyChangedEventArgs("FinishTime"));
                    }
                }
            }
        }
        public string PrettyTimeLeft => TimeLeft.ToPrettyFormat();
        public string PrettyFinishTime => FinishTime?.ToString("G");

        public string RawHtml { get; set; }

        public int? WinnerBet { get; set; }
        public string WinnerName { get; set; }
        public int? WinnedId { get; set; }
    }
}
