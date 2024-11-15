using Microsoft.AspNetCore.Mvc;
using CarDB_Csharp_API.Models;
using CarDB_Csharp_API.Models.Dto;

namespace CarDB_Csharp_API.Controllers
{    
    [ApiController]
    [Route("[controller]")]
    public class CarsController: ControllerBase{

        private readonly ILogger<CarsController> _logger;

        public CarsController(ILogger<CarsController> logger)
        {
            _logger = logger;
        }

        [HttpGet(Name = "GetCars")]
        [HttpPost(Name = "GetFilteredCars")]
        public ActionResult<CarResponseDto> Get(){
            return Ok();
        }
    }
}