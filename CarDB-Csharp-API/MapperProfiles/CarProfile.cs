using AutoMapper;
using CarDB_Csharp_API.Models.Entities;
using CarDB_Csharp_API.Models.Dto;

namespace CarDB_Csharp_API.Profiles{
    public class CarProfile: Profile{
        public CarProfile(){
            CreateMap<Car, CarReadDto>()
                .ForMember(x=>x.Horsepower, opt=>opt.MapFrom(x=>x.HorsePower))
                .ForMember(x=>x.Model_year, opt=>opt.MapFrom(x=>x.ModelYear))
                .ForMember(x=>x.Mpg, opt=>opt.MapFrom(x=>x.MPG));

            CreateMap<CarUpdateDto, Car>()
                .ForMember(x=>x.HorsePower, opt=>opt.MapFrom(x=>x.Horsepower))
                .ForMember(x=>x.ModelYear, opt=>opt.MapFrom(x=>x.Model_year))
                .ForMember(x=>x.MPG, opt=>opt.MapFrom(x=>x.Mpg));

            CreateMap<CarReadDto, Car>()
                .ForMember(x=>x.HorsePower, opt=>opt.MapFrom(x=>x.Horsepower))
                .ForMember(x=>x.ModelYear, opt=>opt.MapFrom(x=>x.Model_year))
                .ForMember(x=>x.MPG, opt=>opt.MapFrom(x=>x.Mpg));
        }
    }
}