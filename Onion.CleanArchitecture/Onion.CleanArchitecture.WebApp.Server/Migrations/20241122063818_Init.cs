using System;
using Microsoft.EntityFrameworkCore.Migrations;

#nullable disable

namespace Onion.CleanArchitecture.WebApp.Server.Migrations
{
    /// <inheritdoc />
    public partial class Init : Migration
    {
        /// <inheritdoc />
        protected override void Up(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.EnsureSchema(
                name: "onion");

            migrationBuilder.CreateTable(
                name: "Products",
                schema: "onion",
                columns: table => new
                {
                    Id = table.Column<int>(type: "int", nullable: false)
                        .Annotation("SqlServer:Identity", "1, 1"),
                    Name = table.Column<string>(type: "nvarchar(max)", nullable: true),
                    Barcode = table.Column<string>(type: "nvarchar(max)", nullable: true),
                    Description = table.Column<string>(type: "nvarchar(max)", nullable: true),
                    Rate = table.Column<decimal>(type: "decimal(18,6)", nullable: true),
                    Price = table.Column<decimal>(type: "decimal(18,6)", nullable: true),
                    State = table.Column<int>(type: "int", nullable: true),
                    CreatedBy = table.Column<string>(type: "nvarchar(max)", nullable: true),
                    Created = table.Column<DateTime>(type: "datetime2", nullable: false),
                    LastModifiedBy = table.Column<string>(type: "nvarchar(max)", nullable: true),
                    LastModified = table.Column<DateTime>(type: "datetime2", nullable: true)
                },
                constraints: table =>
                {
                    table.PrimaryKey("PK_Products", x => x.Id);
                });

            migrationBuilder.CreateTable(
                name: "StateChangeLogs",
                schema: "onion",
                columns: table => new
                {
                    Id = table.Column<int>(type: "int", nullable: false)
                        .Annotation("SqlServer:Identity", "1, 1"),
                    SourceId = table.Column<int>(type: "int", nullable: false),
                    SourceTable = table.Column<string>(type: "nvarchar(max)", nullable: true),
                    OldStatus = table.Column<int>(type: "int", nullable: false),
                    OldStatusTime = table.Column<DateTime>(type: "datetime2", nullable: true),
                    NewStatus = table.Column<int>(type: "int", nullable: false),
                    NewStatusTime = table.Column<DateTime>(type: "datetime2", nullable: true),
                    ChangeTime = table.Column<DateTime>(type: "datetime2", nullable: false),
                    Duration = table.Column<TimeSpan>(type: "time", nullable: true),
                    CreatedBy = table.Column<string>(type: "nvarchar(max)", nullable: true)
                },
                constraints: table =>
                {
                    table.PrimaryKey("PK_StateChangeLogs", x => x.Id);
                });

            migrationBuilder.CreateTable(
                name: "DinhKem",
                schema: "onion",
                columns: table => new
                {
                    Id = table.Column<int>(type: "int", nullable: false)
                        .Annotation("SqlServer:Identity", "1, 1"),
                    Name = table.Column<string>(type: "nvarchar(max)", nullable: true),
                    Size = table.Column<int>(type: "int", nullable: false),
                    Type = table.Column<string>(type: "nvarchar(max)", nullable: true),
                    Url = table.Column<string>(type: "nvarchar(max)", nullable: true),
                    DeleteUrl = table.Column<string>(type: "nvarchar(max)", nullable: true),
                    DeleteType = table.Column<string>(type: "nvarchar(max)", nullable: true),
                    TenDinhKem = table.Column<string>(type: "nvarchar(max)", nullable: true),
                    LoaiDinhKem = table.Column<string>(type: "nvarchar(max)", nullable: true),
                    ProductId = table.Column<int>(type: "int", nullable: false),
                    CreatedBy = table.Column<string>(type: "nvarchar(max)", nullable: true),
                    Created = table.Column<DateTime>(type: "datetime2", nullable: false),
                    LastModifiedBy = table.Column<string>(type: "nvarchar(max)", nullable: true),
                    LastModified = table.Column<DateTime>(type: "datetime2", nullable: true)
                },
                constraints: table =>
                {
                    table.PrimaryKey("PK_DinhKem", x => x.Id);
                    table.ForeignKey(
                        name: "FK_DinhKem_Products_ProductId",
                        column: x => x.ProductId,
                        principalSchema: "onion",
                        principalTable: "Products",
                        principalColumn: "Id",
                        onDelete: ReferentialAction.Cascade);
                });

            migrationBuilder.CreateTable(
                name: "ThaoLuans",
                schema: "onion",
                columns: table => new
                {
                    Id = table.Column<int>(type: "int", nullable: false)
                        .Annotation("SqlServer:Identity", "1, 1"),
                    ProductId = table.Column<int>(type: "int", nullable: true),
                    NoiDung = table.Column<string>(type: "nvarchar(max)", nullable: true),
                    ParentId = table.Column<int>(type: "int", nullable: true),
                    SoLuongPhanHoi = table.Column<int>(type: "int", nullable: false),
                    UserId = table.Column<string>(type: "nvarchar(450)", nullable: true),
                    CreatedBy = table.Column<string>(type: "nvarchar(max)", nullable: true),
                    Created = table.Column<DateTime>(type: "datetime2", nullable: false),
                    LastModifiedBy = table.Column<string>(type: "nvarchar(max)", nullable: true),
                    LastModified = table.Column<DateTime>(type: "datetime2", nullable: true)
                },
                constraints: table =>
                {
                    table.PrimaryKey("PK_ThaoLuans", x => x.Id);
                    table.ForeignKey(
                        name: "FK_ThaoLuans_Products_ProductId",
                        column: x => x.ProductId,
                        principalSchema: "onion",
                        principalTable: "Products",
                        principalColumn: "Id");
                    table.ForeignKey(
                        name: "FK_ThaoLuans_User_UserId",
                        column: x => x.UserId,
                        principalSchema: "onion",
                        principalTable: "User",
                        principalColumn: "Id");
                });

            migrationBuilder.CreateTable(
                name: "DinhKemThaoLuans",
                schema: "onion",
                columns: table => new
                {
                    Id = table.Column<int>(type: "int", nullable: false)
                        .Annotation("SqlServer:Identity", "1, 1"),
                    Name = table.Column<string>(type: "nvarchar(max)", nullable: true),
                    Size = table.Column<int>(type: "int", nullable: false),
                    Type = table.Column<string>(type: "nvarchar(max)", nullable: true),
                    Url = table.Column<string>(type: "nvarchar(max)", nullable: true),
                    DeleteUrl = table.Column<string>(type: "nvarchar(max)", nullable: true),
                    DeleteType = table.Column<string>(type: "nvarchar(max)", nullable: true),
                    TenDinhKem = table.Column<string>(type: "nvarchar(max)", nullable: true),
                    LoaiDinhKem = table.Column<string>(type: "nvarchar(max)", nullable: true),
                    ThaoLuanId = table.Column<int>(type: "int", nullable: false),
                    CreatedBy = table.Column<string>(type: "nvarchar(max)", nullable: true),
                    Created = table.Column<DateTime>(type: "datetime2", nullable: false),
                    LastModifiedBy = table.Column<string>(type: "nvarchar(max)", nullable: true),
                    LastModified = table.Column<DateTime>(type: "datetime2", nullable: true)
                },
                constraints: table =>
                {
                    table.PrimaryKey("PK_DinhKemThaoLuans", x => x.Id);
                    table.ForeignKey(
                        name: "FK_DinhKemThaoLuans_ThaoLuans_ThaoLuanId",
                        column: x => x.ThaoLuanId,
                        principalSchema: "onion",
                        principalTable: "ThaoLuans",
                        principalColumn: "Id",
                        onDelete: ReferentialAction.Cascade);
                });

            migrationBuilder.CreateIndex(
                name: "IX_DinhKem_ProductId",
                schema: "onion",
                table: "DinhKem",
                column: "ProductId");

            migrationBuilder.CreateIndex(
                name: "IX_DinhKemThaoLuans_ThaoLuanId",
                schema: "onion",
                table: "DinhKemThaoLuans",
                column: "ThaoLuanId");

            migrationBuilder.CreateIndex(
                name: "IX_ThaoLuans_ProductId",
                schema: "onion",
                table: "ThaoLuans",
                column: "ProductId");

            migrationBuilder.CreateIndex(
                name: "IX_ThaoLuans_UserId",
                schema: "onion",
                table: "ThaoLuans",
                column: "UserId");
        }

        /// <inheritdoc />
        protected override void Down(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DropTable(
                name: "DinhKem",
                schema: "onion");

            migrationBuilder.DropTable(
                name: "DinhKemThaoLuans",
                schema: "onion");

            migrationBuilder.DropTable(
                name: "StateChangeLogs",
                schema: "onion");

            migrationBuilder.DropTable(
                name: "ThaoLuans",
                schema: "onion");

            migrationBuilder.DropTable(
                name: "Products",
                schema: "onion");
        }
    }
}
