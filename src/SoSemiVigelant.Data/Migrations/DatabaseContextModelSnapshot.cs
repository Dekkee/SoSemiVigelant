using System;
using Microsoft.EntityFrameworkCore;
using Microsoft.EntityFrameworkCore.Infrastructure;
using Microsoft.EntityFrameworkCore.Metadata;
using Microsoft.EntityFrameworkCore.Migrations;
using SoSemiVigelant.Data.Data;

namespace SoSemiVigelant.Data.Migrations
{
    [DbContext(typeof(DatabaseContext))]
    partial class DatabaseContextModelSnapshot : ModelSnapshot
    {
        protected override void BuildModel(ModelBuilder modelBuilder)
        {
            modelBuilder
                .HasAnnotation("ProductVersion", "1.1.0-rtm-22752")
                .HasAnnotation("SqlServer:ValueGenerationStrategy", SqlServerValueGenerationStrategy.IdentityColumn);

            modelBuilder.Entity("SoSemiVigelant.Data.Entities.Auction", b =>
                {
                    b.Property<int>("Id")
                        .ValueGeneratedOnAdd()
                        .HasAnnotation("SqlServer:ValueGenerationStrategy", SqlServerValueGenerationStrategy.IdentityColumn);

                    b.Property<int?>("Bid");

                    b.Property<int?>("BuyOut");

                    b.Property<string>("City");

                    b.Property<int>("CreatorId");

                    b.Property<int>("CurrentBet");

                    b.Property<DateTime?>("FinishTime");

                    b.Property<bool>("IsFinished");

                    b.Property<string>("Name");

                    b.Property<int>("Step");

                    b.Property<int>("TotalBets");

                    b.Property<int?>("WinnerBet");

                    b.Property<int?>("WinnerId");

                    b.HasKey("Id");

                    b.HasIndex("CreatorId");

                    b.HasIndex("WinnerId");

                    b.ToTable("Auctions");
                });

            modelBuilder.Entity("SoSemiVigelant.Data.Entities.User", b =>
                {
                    b.Property<int>("Id");

                    b.Property<string>("Name");

                    b.Property<int>("OriginId");

                    b.HasKey("Id");

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
