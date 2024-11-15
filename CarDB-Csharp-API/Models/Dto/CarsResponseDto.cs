
namespace CarDB_Csharp_API.Models.Dto
{
    public class CarResponseDto{
        public CarReadDto[]? cars {get; set;}
        public required int total {get; set;}
    }
}