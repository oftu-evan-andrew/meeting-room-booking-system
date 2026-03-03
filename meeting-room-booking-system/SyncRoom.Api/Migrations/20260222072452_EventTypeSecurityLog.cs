using Microsoft.EntityFrameworkCore.Migrations;

#nullable disable

namespace SyncRoom.Api.Migrations
{
    /// <inheritdoc />
    public partial class EventTypeSecurityLog : Migration
    {
        /// <inheritdoc />
        protected override void Up(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.AddColumn<string>(
                name: "EventType",
                table: "SecurityLoggings",
                type: "nvarchar(max)",
                nullable: true);
        }

        /// <inheritdoc />
        protected override void Down(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DropColumn(
                name: "EventType",
                table: "SecurityLoggings");
        }
    }
}
