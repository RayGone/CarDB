using Microsoft.AspNetCore.Mvc;
using CarDB_Csharp_API.Models;
using CarDB_Csharp_API.Models.Dto;
using Microsoft.VisualBasic;

namespace CarDB_Csharp_API.Controllers
{    
    [ApiController]
    [Route("[controller]")]
    public class CarsController: ControllerBase{

        private readonly ILogger<CarsController> _logger;
        private readonly CarServices _service;

        public CarsController(
            ILogger<CarsController> logger,
            CarServices service)
        {
            _logger = logger;
            _service = service;
        }

        [HttpGet(Name = "GetCars")]
        public ActionResult<CarResponseDto> Get([FromQuery] QueryModelDto query)
        {
            return Ok(_service.runQuery(query));
        }

        [HttpPost("filterSearch",Name = "GetFilteredCars")]
        public ActionResult<CarResponseDto> FilteredSearch([FromBody] QueryModelDto query)
        {
            return Ok(_service.runQuery(query));
        }

        [HttpPost("add", Name="AddCar")]
        public ActionResult<CarReadDto>AddCar([FromBody] CarUpdateDto car)
        {
            var dto = _service.addCar(car);
            return dto;
        }

        [HttpDelete("delete/{id}", Name = "DeleteCar")]
        public ActionResult<CarReadDto> DeleteCar([FromRoute] int id){
            var dto = _service.deleteCar(id);
            return Ok(dto);
        }

        [HttpPatch("edit/{id}", Name="EditCar")]
        public ActionResult<CarReadDto> EditCar([FromRoute] int id, [FromBody] CarReadDto inCar){
            if(id!=inCar.Id){
                return BadRequest(new {error = "Invalid Car Object Recieved!", car=inCar});
            }
            _service.updateCar(inCar);
            return inCar;
        }

        [HttpGet("download/{dtype}", Name ="Download")]
        public IActionResult Download([FromRoute] string dtype){
            switch(dtype){
                case "csv":
                    var csv = _service.getCSVString();
                    var cbytes = System.Text.Encoding.UTF8.GetBytes(csv); 
                    var cresult = new FileContentResult(cbytes, "text/csv") { 
                        FileDownloadName = "cars.csv" 
                    }; 
                    return cresult;
                case "json":
                    var json = _service.getJSONString();
                    var jbytes = System.Text.Encoding.UTF8.GetBytes(json); 
                    var jresult = new FileContentResult(jbytes, "application/json") { 
                        FileDownloadName = "cars.json" 
                    }; 
                    return jresult;
                case "default":
                    break;
            }

            return Ok();
        }
    }
}