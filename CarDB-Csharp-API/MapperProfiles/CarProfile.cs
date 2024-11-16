using AutoMapper;
using CarDB_Csharp_API.Models.Entities;
using CarDB_Csharp_API.Models.Dto;

namespace CarDB_Csharp_API.Profiles{
    public class CarProfile: Profile{
        public CarProfile(){
            CreateMap<Car, CarReadDto>();

            CreateMap<CarUpdateDto, Car>();
            CreateMap<CarReadDto, Car>();
        }
    }
}