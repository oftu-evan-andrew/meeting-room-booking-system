using System;
using Microsoft.EntityFrameworkCore.Migrations;

#nullable disable

namespace SyncRoom.Api.Migrations
{
    /// <inheritdoc />
    public partial class RemoveLoggedInAndLoggedOut : Migration
    {
        /// <inheritdoc />
        protected override void Up(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DropColumn(
                name: "LoggedIn",
                table: "Users");

            migrationBuilder.DropColumn(
                name: "LoggedOut",
                table: "Users");
        }

        /// <inheritdoc />
        protected override void Down(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.AddColumn<DateOnly>(
                name: "LoggedIn",
                table: "Users",
                type: "date",
                nullable: true);

            migrationBuilder.AddColumn<DateOnly>(
                name: "LoggedOut",
                table: "Users",
                type: "date",
                nullable: true);
        }
    }
}
