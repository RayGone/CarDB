using System.Collections.Generic;

namespace CarDB_Csharp_API.Models.Dto
{
    public class FilterDto{
        public required string Field {get; set;}
        public required string Ops {get; set;}
        public required float Value {get; set;}
    }

    public class QueryModelDto{
        public List<FilterDto>? Filter {get; set;} = [];
        public required int Limit {get; set;} = 5;
        public required int Page {get; set;} = 0;
        public string? Order {get; set;} = "asc";
        public string? OrderBy {get; set;} = "id";
        public string? Search {get; set;} = string.Empty;
    }
}