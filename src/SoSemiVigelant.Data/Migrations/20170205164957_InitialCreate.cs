using System;
using System.Collections.Generic;
using Microsoft.EntityFrameworkCore.Migrations;
using Microsoft.EntityFrameworkCore.Metadata;

namespace SoSemiVigelant.Data.Migrations
{
    public partial class InitialCreate : Migration
    {
        protected override void Up(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.CreateTable(
                name: "Users",
                columns: table => new
                {
                    Id = table.Column<int>(nullable: false),
                    Name = table.Column<string>(nullable: true),
                    OriginId = table.Column<int>(nullable: false)
                },
                constraints: table =>
                {
                    table.PrimaryKey("PK_Users", x => x.Id);
                });

            migrationBuilder.CreateTable(
                name: "Auctions",
                columns: table => new
                {
                    Id = table.Column<int>(nullable: false)
                        .Annotation("SqlServer:ValueGenerationStrategy", SqlServerValueGenerationStrategy.IdentityColumn),
                    Bid = table.Column<int>(nullable: true),
                    BuyOut = table.Column<int>(nullable: true),
                    City = table.Column<string>(nullable: true),
                    CreatorId = table.Column<int>(nullable: false),
                    CurrentBet = table.Column<int>(nullable: false),
                    FinishTime = table.Column<DateTime>(nullable: true),
                    IsFinished = table.Column<bool>(nullable: false),
                    Name = table.Column<string>(nullable: true),
                    Step = table.Column<int>(nullable: false),
                    TotalBets = table.Column<int>(nullable: false),
                    WinnerBet = table.Column<int>(nullable: true),
                    WinnerId = table.Column<int>(nullable: true)
                },
                constraints: table =>
                {
                    table.PrimaryKey("PK_Auctions", x => x.Id);
                    table.ForeignKey(
                        name: "FK_Auctions_Users_CreatorId",
                        column: x => x.CreatorId,
                        principalTable: "Users",
                        principalColumn: "Id",
                        onDelete: ReferentialAction.Cascade);
                    table.ForeignKey(
                        name: "FK_Auctions_Users_WinnerId",
                        column: x => x.WinnerId,
                        principalTable: "Users",
                        principalColumn: "Id",
                        onDelete: ReferentialAction.Restrict);
                });

            migrationBuilder.CreateIndex(
                name: "IX_Auctions_CreatorId",
                table: "Auctions",
                column: "CreatorId");

            migrationBuilder.CreateIndex(
                name: "IX_Auctions_WinnerId",
                table: "Auctions",
                column: "WinnerId");
        }

        protected override void Down(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DropTable(
                name: "Auctions");

            migrationBuilder.DropTable(
                name: "Users");
        }
    }
}
