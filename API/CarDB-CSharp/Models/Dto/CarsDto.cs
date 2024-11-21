
namespace CarDB_Csharp_API.Models.Dto
{
    public class CarReadDto
    {
        public int Id { get; set; }
        public required string Name { get; set; }
        public required string Origin { get; set; }
        public required int Model_year { get; set; }
        public float? Acceleration { get; set; }
        public float? Horsepower { get; set; }
        public float? Mpg { get; set; }
        public float? Cylinders { get; set; }
        public float? Weight { get; set; }
        public float? Displacement { get; set; }
    }
    public class CarUpdateDto
    {
        public required string Name { get; set; }
        public required string Origin { get; set; }
        public required int Model_year { get; set; }
        public float? Acceleration { get; set; }
        public float? Horsepower { get; set; }
        public float? Mpg { get; set; }
        public float? Cylinders { get; set; }
        public float? Weight { get; set; }
        public float? Displacement { get; set; }
    }
}