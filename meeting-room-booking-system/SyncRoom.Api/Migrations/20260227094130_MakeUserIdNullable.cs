using System;
using Microsoft.EntityFrameworkCore.Migrations;

#nullable disable

namespace SyncRoom.Api.Migrations
{
    /// <inheritdoc />
    public partial class MakeUserIdNullable : Migration
    {
        /// <inheritdoc />
        protected override void Up(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DropForeignKey(
                name: "FK_SecurityLoggings_AspNetUsers_UserId",
                table: "SecurityLoggings");

            migrationBuilder.AlterColumn<Guid>(
                name: "UserId",
                table: "SecurityLoggings",
                type: "uniqueidentifier",
                nullable: true,
                oldClrType: typeof(Guid),
                oldType: "uniqueidentifier");

            migrationBuilder.AddColumn<string>(
                name: "Participants",
                table: "Bookings",
                type: "nvarchar(max)",
                nullable: true);

            migrationBuilder.AddForeignKey(
                name: "FK_SecurityLoggings_AspNetUsers_UserId",
                table: "SecurityLoggings",
                column: "UserId",
                principalTable: "AspNetUsers",
                principalColumn: "Id");
        }

        /// <inheritdoc />
        protected override void Down(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DropForeignKey(
                name: "FK_SecurityLoggings_AspNetUsers_UserId",
                table: "SecurityLoggings");

            migrationBuilder.DropColumn(
                name: "Participants",
                table: "Bookings");

            migrationBuilder.AlterColumn<Guid>(
                name: "UserId",
                table: "SecurityLoggings",
                type: "uniqueidentifier",
                nullable: false,
                defaultValue: new Guid("00000000-0000-0000-0000-000000000000"),
                oldClrType: typeof(Guid),
                oldType: "uniqueidentifier",
                oldNullable: true);

            migrationBuilder.AddForeignKey(
                name: "FK_SecurityLoggings_AspNetUsers_UserId",
                table: "SecurityLoggings",
                column: "UserId",
                principalTable: "AspNetUsers",
                principalColumn: "Id",
                onDelete: ReferentialAction.Cascade);
        }
    }
}
