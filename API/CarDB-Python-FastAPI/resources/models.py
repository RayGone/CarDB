from pydantic import BaseModel, Field
from enum import Enum
from typing import Optional, Literal

class Car(BaseModel):
    id: Optional[int] = Field(ge=0)
    name: str = Field(title="Car Name", max_length=100)
    origin: str = Field(title="Car Origin", max_length=20)
    model_year: int = Field(title="Car Model Year", gt=0)
    acceleration: Optional[float] = Field(ge=0.0)
    horsepower: Optional[float] = Field(ge=0.0)
    mpg: Optional[float] = Field(ge=0.0)
    weight: Optional[float] = Field(ge=0.0)
    cylinders: Optional[float] = Field(ge=0.0)
    displacement: Optional[float] = Field(ge=0.0)
    
class CarAttributesEnum(Enum):
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
    
class FilterOpsEnum(Enum):
    EQUAL = "=="
    NOT_EQUAL = "!="
    GREATER_THAN = ">"
    LESS_THAN = "<"
    GREATER_OR_EQUAL = ">="
    LESS_OR_EQUAL = "<="
    
class OrderEnum(Enum):
    ASC = "asc"
    DESC = "desc"

class FilterCondition(BaseModel):
    field: CarAttributesEnum
    ops: FilterOpsEnum
    value: float

class DataFilterModel(BaseModel):
    filter: list[FilterCondition] = Field([], description="List of filters")
    limit: int = Field(5, ge=0, description="Max number of entries in a page")
    order: OrderEnum = Field(OrderEnum.ASC.value)
    orderBy: CarAttributesEnum = Field(CarAttributesEnum.ID.value)
    search: str = Field('', max_length=50)
    page: int = Field(0, ge=0)


if __name__ == "__main__":
    car = Car(id=0, name="TestCar", origin="NPL", model_year=2024, acceleration=18,
              horsepower=200, mpg=20, weight=500, cylinders=6, displacement=20)
    response = CarResponse(cars=[car],total=1)
    
    print("Test Car and CarResponse model\n",response)
    print()
    
    carFilter = FilterCondition(field='horsepower',ops=">",value="50")
    filterModel = DataFilterModel(filter=[carFilter],limit=20,page=20)
    print("Test Car filter model\n",filterModel)