using AutoMapper;
using CarDB_Csharp_API.Models.Dto;
using CarDB_Csharp_API.Models.Entities;
using CarDB_Csharp_API.Models.Helper;
// using System.Collections.Generic;
// using Microsoft.EntityFrameworkCore;
// using System.Linq;
using System.Linq.Dynamic.Core;
// using System.Text.Json;
// using Newtonsoft.Json;

public interface ICarServices{
    public CarResponseDto runQuery(QueryModelDto query);
    public CarReadDto deleteCar(int Id);
    public CarReadDto updateCar(CarReadDto car);
}

public class CarServices: ICarServices{
    private readonly string def_OrderBy = "Id";
    private readonly string def_Order = "asc";
    private readonly int def_Limit = 10;

    private readonly CarDBContext _context;
    private readonly IMapper _mapper;
    public CarServices(CarDBContext context,
                    IMapper mapper)
    {
        _mapper = mapper;
        _context = context;
    }

    public CarResponseDto runQuery(QueryModelDto query){
        var order = query.Order is not null? query.Order : def_OrderBy;
        var orderBy = query.OrderBy is not null ? query.OrderBy : def_Order;
        var limit = query.Limit > def_Limit ? query.Limit : def_Limit;
        var page = query.Page < 0 ? 0 : query.Page;
        var search = query.Search;
        var filter = query.Filter is not null ? query.Filter : [];

        var orderExpression = $"{CarAttributeHelper.getAttribute(orderBy)} {order}";
        var q = _context.Cars
                    .OrderBy(orderExpression).AsQueryable();
        
        if(!string.IsNullOrEmpty(search))
        {
            search = search.ToLower();
            q = q.Where(row => row.Name.ToLower().Contains(search) || row.Origin.ToLower().Contains(search));
        }

        foreach(var f in filter) {            
            var comparisonExpression = $"{CarAttributeHelper.getAttribute(f.Field)} {f.Ops} {f.Value}";
            q = q.Where(comparisonExpression);
        }

        var total = q.Count();
        
        var cars = q.Skip(page*limit)
                    .Take(limit)
                    .ToList();

        return new CarResponseDto{
            cars = _mapper.Map<List<CarReadDto>>(cars),
            total= total
        };
    }
    
    public CarReadDto deleteCar(int Id){
        var car = _context.Cars.Where(row => row.Id == Id).FirstOrDefault();
        if(car is null){
            throw new ArgumentNullException(nameof(car));
        }
        var cardto = _mapper.Map<CarReadDto>(car);
        _context.Cars.Remove(car);
        _context.SaveChanges();
        return cardto;
    }

    public CarReadDto updateCar(CarReadDto car){
        var carEnt = _mapper.Map<Car>(car);
        _context.Cars.Update(carEnt);
        _context.SaveChanges();
        return car;
    }
}