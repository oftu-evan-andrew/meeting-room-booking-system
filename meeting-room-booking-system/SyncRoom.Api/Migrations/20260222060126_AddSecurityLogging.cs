using System;
using Microsoft.EntityFrameworkCore.Migrations;

#nullable disable

namespace SyncRoom.Api.Migrations
{
    /// <inheritdoc />
    public partial class AddSecurityLogging : Migration
    {
        /// <inheritdoc />
        protected override void Up(MigrationBuilder migrationBuilder)
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

            migrationBuilder.CreateTable(
                name: "SecurityLoggings",
                columns: table => new
                {
                    Id = table.Column<Guid>(type: "uniqueidentifier", nullable: false),
                    UserId = table.Column<Guid>(type: "uniqueidentifier", nullable: false),
                    Timestamps = table.Column<DateTime>(type: "datetime2", nullable: false),
                    IsSuccessful = table.Column<bool>(type: "bit", nullable: false),
                    IpAddress = table.Column<string>(type: "nvarchar(max)", nullable: true),
                    FailureReason = table.Column<string>(type: "nvarchar(max)", nullable: true)
                },
                constraints: table =>
                {
                    table.PrimaryKey("PK_SecurityLoggings", x => x.Id);
                    table.ForeignKey(
                        name: "FK_SecurityLoggings_Users_UserId",
                        column: x => x.UserId,
                        principalTable: "Users",
                        principalColumn: "Id",
                        onDelete: ReferentialAction.Cascade);
                });

            migrationBuilder.CreateIndex(
                name: "IX_SecurityLoggings_Timestamps",
                table: "SecurityLoggings",
                column: "Timestamps");

            migrationBuilder.CreateIndex(
                name: "IX_SecurityLoggings_UserId",
                table: "SecurityLoggings",
                column: "UserId");
        }

        /// <inheritdoc />
        protected override void Down(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DropTable(
                name: "SecurityLoggings");

            migrationBuilder.DropColumn(
                name: "LoggedIn",
                table: "Users");

            migrationBuilder.DropColumn(
                name: "LoggedOut",
                table: "Users");
        }
    }
}
