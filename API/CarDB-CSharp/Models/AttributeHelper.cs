namespace CarDB_Csharp_API.Models.Helper{
    public static class CarAttributeHelper{
        public static Dictionary<string,string> attributeMap = new Dictionary<string, string>{
            {"id", "Id"},
            {"name", "Name"},
            {"origin", "Origin"},
            {"model_year", "ModelYear"},
            {"acceleration", "Acceleration"},
            {"horsepower", "HorsePower"},
            {"mpg", "MPG"},
            {"weight", "Weight"},
            {"cylinders", "Cylinders"},
            {"displacement", "Displacement"}
        };
        public static string getAttribute(string attr){
            return CarAttributeHelper.attributeMap[attr];
        }
    }
}