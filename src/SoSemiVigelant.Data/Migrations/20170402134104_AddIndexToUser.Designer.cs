using System;
using Microsoft.EntityFrameworkCore;
using Microsoft.EntityFrameworkCore.Infrastructure;
using Microsoft.EntityFrameworkCore.Metadata;
using Microsoft.EntityFrameworkCore.Migrations;
using SoSemiVigelant.Data.Data;

namespace SoSemiVigelant.Data.Migrations
{
    [DbContext(typeof(DatabaseContext))]
    [Migration("20170402134104_AddIndexToUser")]
    partial class AddIndexToUser
    {
        protected override void BuildTargetModel(ModelBuilder modelBuilder)
        {
            modelBuilder
                .HasAnnotation("Npgsql:ValueGenerationStrategy", NpgsqlValueGenerationStrategy.SerialColumn)
                .HasAnnotation("ProductVersion", "1.1.1");

            modelBuilder.Entity("SoSemiVigelant.Data.Entities.Auction", b =>
                {
                    b.Property<int>("Id")
                        .ValueGeneratedOnAdd()
                        .HasAnnotation("Npgsql:ValueGenerationStrategy", NpgsqlValueGenerationStrategy.SerialColumn);

                    b.Property<int?>("AuctionId");

                    b.Property<int?>("Bet");

                    b.Property<int?>("BuyOut");

                    b.Property<string>("City");

                    b.Property<int>("CreatorId");

                    b.Property<int>("CurrentBet");

                    b.Property<string>("Description");

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
                        .ValueGeneratedOnAdd()
                        .HasAnnotation("Npgsql:ValueGenerationStrategy", NpgsqlValueGenerationStrategy.SerialColumn);

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
