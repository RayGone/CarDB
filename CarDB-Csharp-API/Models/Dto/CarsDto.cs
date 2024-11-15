
namespace CarDB_Csharp_API.Models.Dto
{
    public class CarReadDto
    {
        public int Id { get; set; }
        public required string Name { get; set; }
        public required string Origin { get; set; }
        public required int Model_year { get; set; }
        public int? Acceleration { get; set; }
        public int? HorsePower { get; set; }
        public int? MPG { get; set; }
        public int? Cylinders { get; set; }
        public int? Weight { get; set; }
        public int? Displacement { get; set; }
    }
    public class CarUpdateDto
    {
        public required string Name { get; set; }
        public required string Origin { get; set; }
        public required int Model_year { get; set; }
        public int? Acceleration { get; set; }
        public int? HorsePower { get; set; }
        public int? MPG { get; set; }
        public int? Cylinders { get; set; }
        public int? Weight { get; set; }
        public int? Displacement { get; set; }
    }
}