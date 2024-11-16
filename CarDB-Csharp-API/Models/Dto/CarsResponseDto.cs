using System.Collections.Generic;

namespace CarDB_Csharp_API.Models.Dto
{
    public class CarResponseDto{
        public List<CarReadDto>? cars {get; set;}
        public required int total {get; set;}
    }
}