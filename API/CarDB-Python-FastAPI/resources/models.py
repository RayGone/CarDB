from pydantic import BaseModel
from enum import Enum
from typing import Optional

class Car(BaseModel):
    id: int
    name: str
    origin: str
    model_year: int
    acceleration: Optional[float]
    horsepower: Optional[float]
    mpg: Optional[float]
    weight: Optional[float]
    cylinders: Optional[float]
    displacement: Optional[float]
    
class CarAttributes(Enum):
    ID = "id"
    NAME = "name"
    ORIGIN = "origin"
    YEAR = "model_year"
    ACC = "acceleration"
    HP = "horsepower"
    MPG = "mpg"
    WEIGHT = "weight"
    CYLINDERS = "cylinders"
    DISPLACEMENT = 'displacement'

class CarResponse(BaseModel):
    cars: list[Car]
    total: int
    
class FilterOps(Enum):
    EQUAL = "=="
    NOT_EQUAL = "!="
    GREATER_THAN = ">"
    LESS_THAN = "<"
    GREATER_OR_EQUAL = ">="
    LESS_OR_EQUAL = "<="
    
class Order(Enum):
    ASC = "asc"
    DESC = "desc"

class FilterCondition(BaseModel):
    field: CarAttributes
    ops: FilterOps
    value: str

class DataFilterModel(BaseModel):
    filter: list[FilterCondition] = []
    limit: int = 5
    order: Order = 'asc'
    orderBy: CarAttributes = 'id'
    search: str = ''
    page: int = 0


if __name__ == "__main__":
    car = Car(id=0, name="TestCar", origin="NPL", model_year=2024, acceleration=18,
              horsepower=200, mpg=20, weight=500, cylinders=6, displacement=20)
    response = CarResponse(cars=[car],total=1)
    
    print("Test Car and CarResponse model\n",response)
    print()
    
    carFilter = FilterCondition(field='horsepower',ops=">",value="50")
    filterModel = DataFilterModel(filter=[carFilter],limit=20,page=20)
    print("Test Car filter model\n",filterModel)