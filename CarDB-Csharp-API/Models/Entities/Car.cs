using System;
using System.Collections.Generic;
using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;
using System.Diagnostics.Contracts;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace CarDB_Csharp_API.Models.Entities
{
    [Table("Cars", Schema = "CarDB")]
    public class Car{
        [Key]
        public int Id {get; set;}
        [Required]
        public required string Name {get; set;}
        [Required]
        public required string Origin {get; set;}
        [Required]
        public required int ModelYear {get; set;}
        public int? Acceleration {get; set;}
        public int? HorsePower {get; set;}
        public int? MPG {get; set;}
        public int? Cylinders {get; set;}
        public int? Weight {get; set;}
        public int? Displacement {get; set;}
    }
}