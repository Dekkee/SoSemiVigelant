using System;
using System.Collections.Generic;
using System.ComponentModel;
using System.ComponentModel.DataAnnotations.Schema;
using System.Linq;
using System.Text;
using System.Threading.Tasks;
using System.Windows;
using System.Windows.Input;
using Microsoft.EntityFrameworkCore;

namespace SoSemiVigelant.Data.Entities
{
    public class Auction
    {
        [DatabaseGenerated(DatabaseGeneratedOption.Identity)]
        public int Id { get; set; }
        public string Name { get; set; }

        [ForeignKey("Creator")]
        public int CreatorId { get; set; }
        public User Creator { get; set; }

        public string City { get; set; }
        public int? Bet { get; set; }
        public int CurrentBet { get; set; }
        public int TotalBets { get; set; }
        public int Step { get; set; }
        public int? BuyOut { get; set; }

        public TimeSpan? TimeLeft { get; set; }
        public bool IsFinished { get; set; }
        public int? WinnerBet { get; set; }

        [ForeignKey("Winner")]
        public int? WinnerId { get; set; }
        public User Winner { get; set; }

        public int? AuctionId { get; set; }

        public static void Setup(ModelBuilder builder)
        {
            builder.Entity<Auction>()
                .HasIndex(_ => _.AuctionId);
        }
    }
}
