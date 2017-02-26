using System;
using System.Collections.Generic;
using Microsoft.EntityFrameworkCore.Migrations;

namespace SoSemiVigelant.Data.Migrations
{
    public partial class TimeLeftToTicks : Migration
    {
        protected override void Up(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DropColumn(name: "TimeLeft",
                table: "Auctions");

            migrationBuilder.AddColumn<long>(name: "TimeLeft",
                table: "Auctions",
                nullable: true);
        }

        protected override void Down(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DropColumn(name: "TimeLeft",
                table: "Auctions");

            migrationBuilder.AddColumn<TimeSpan>(name: "TimeLeft",
                table: "Auctions",
                nullable: true);
        }
    }
}
