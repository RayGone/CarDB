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
        public float? Acceleration {get; set;}
        public float? HorsePower {get; set;}
        public float? MPG {get; set;}
        public float? Cylinders {get; set;}
        public float? Weight {get; set;}
        public float? Displacement {get; set;}
    }
}