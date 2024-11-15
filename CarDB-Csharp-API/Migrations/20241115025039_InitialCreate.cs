using Microsoft.EntityFrameworkCore.Migrations;

#nullable disable

namespace CarDB_Csharp_API.Migrations
{
    /// <inheritdoc />
    public partial class InitialCreate : Migration
    {
        /// <inheritdoc />
        protected override void Up(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.EnsureSchema(
                name: "CarDB");

            migrationBuilder.CreateTable(
                name: "Cars",
                schema: "CarDB",
                columns: table => new
                {
                    Id = table.Column<int>(type: "int", nullable: false)
                        .Annotation("SqlServer:Identity", "1, 1"),
                    Name = table.Column<string>(type: "nvarchar(max)", nullable: false),
                    Origin = table.Column<string>(type: "nvarchar(max)", nullable: false),
                    ModelYear = table.Column<int>(type: "int", nullable: false),
                    Acceleration = table.Column<int>(type: "int", nullable: true),
                    HorsePower = table.Column<int>(type: "int", nullable: true),
                    MPG = table.Column<int>(type: "int", nullable: true),
                    Cylinders = table.Column<int>(type: "int", nullable: true),
                    Weight = table.Column<int>(type: "int", nullable: true),
                    Displacement = table.Column<int>(type: "int", nullable: true)
                },
                constraints: table =>
                {
                    table.PrimaryKey("PK_Cars", x => x.Id);
                });
        }

        /// <inheritdoc />
        protected override void Down(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DropTable(
                name: "Cars",
                schema: "CarDB");
        }
    }
}
