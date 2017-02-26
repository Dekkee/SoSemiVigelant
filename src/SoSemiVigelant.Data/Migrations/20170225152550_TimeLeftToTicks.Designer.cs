using System;
using Microsoft.EntityFrameworkCore;
using Microsoft.EntityFrameworkCore.Infrastructure;
using Microsoft.EntityFrameworkCore.Metadata;
using Microsoft.EntityFrameworkCore.Migrations;
using SoSemiVigelant.Data.Data;

namespace SoSemiVigelant.Data.Migrations
{
    [DbContext(typeof(DatabaseContext))]
    [Migration("20170225152550_TimeLeftToTicks")]
    partial class TimeLeftToTicks
    {
        protected override void BuildTargetModel(ModelBuilder modelBuilder)
        {
            modelBuilder
                .HasAnnotation("ProductVersion", "1.1.0-rtm-22752")
                .HasAnnotation("SqlServer:ValueGenerationStrategy", SqlServerValueGenerationStrategy.IdentityColumn);

            modelBuilder.Entity("SoSemiVigelant.Data.Entities.Auction", b =>
                {
                    b.Property<int>("Id")
                        .ValueGeneratedOnAdd()
                        .HasAnnotation("SqlServer:ValueGenerationStrategy", SqlServerValueGenerationStrategy.IdentityColumn);

                    b.Property<int?>("AuctionId");

                    b.Property<int?>("Bet");

                    b.Property<int?>("BuyOut");

                    b.Property<string>("City");

                    b.Property<int>("CreatorId");

                    b.Property<int>("CurrentBet");

                    b.Property<bool>("IsFinished");

                    b.Property<string>("Name");

                    b.Property<int>("Step");

                    b.Property<long?>("TimeLeft");

                    b.Property<int>("TotalBets");

                    b.Property<int?>("WinnerBet");

                    b.Property<int?>("WinnerId");

                    b.HasKey("Id");

                    b.HasIndex("AuctionId");

                    b.HasIndex("CreatorId");

                    b.HasIndex("WinnerId");

                    b.ToTable("Auctions");
                });

            modelBuilder.Entity("SoSemiVigelant.Data.Entities.User", b =>
                {
                    b.Property<int>("Id")
                        .ValueGeneratedOnAdd();

                    b.Property<string>("Name");

                    b.Property<int>("OriginId");

                    b.HasKey("Id");

                    b.HasIndex("Name");

                    b.ToTable("Users");
                });

            modelBuilder.Entity("SoSemiVigelant.Data.Entities.Auction", b =>
                {
                    b.HasOne("SoSemiVigelant.Data.Entities.User", "Creator")
                        .WithMany()
                        .HasForeignKey("CreatorId")
                        .OnDelete(DeleteBehavior.Cascade);

                    b.HasOne("SoSemiVigelant.Data.Entities.User", "Winner")
                        .WithMany()
                        .HasForeignKey("WinnerId");
                });
        }
    }
}
