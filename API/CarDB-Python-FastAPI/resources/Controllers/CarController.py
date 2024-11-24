from fastapi import APIRouter, Request, Depends, HTTPException
from fastapi.responses import StreamingResponse
from ..models import DataFilterModel, OrderEnum, CarAttributesEnum, Car
from ..db import RunQuery, GetById, RemoveCar, InsertCar, UpdateCar, GetAll
from json import dumps as json_encode
import csv
import io

def filterMapper(f: dict) -> DataFilterModel:   
    if f:        
        try:
            filterModel = DataFilterModel(**f)
            filterModel.order = OrderEnum(filterModel.order)
            filterModel.orderBy = CarAttributesEnum(filterModel.orderBy)
        except Exception as e:
            raise HTTPException(405, e)
        return filterModel
    
    else:
        return DataFilterModel()


def queryMapper(request: Request):
    return filterMapper(request.query_params)
        

routes = APIRouter(
    prefix="/cars",
    tags=["Cars"],)

@routes.get("/", name="Get Car")
def getCar(filterModel: DataFilterModel = Depends(queryMapper)):
    return RunQuery(filterModel)


@routes.post("/filterSearch", name="Get Filtered Car")
def getCar(filterModel: DataFilterModel = Depends(filterMapper)):
    return RunQuery(filterModel)

@routes.post("/add", name="Add New Car")
def addCar(car: Car):
    insert_id = InsertCar(car)
    newCar = GetById(insert_id)
    return newCar

@routes.patch("/edit/{id}", name="Add New Car")
def addCar(id: int, car: Car):
    if id != car.id:
        HTTPException(405, "Edit Car Doesn't Exist")
    
    UpdateCar(car)
    return car

@routes.delete("/delete/{id}", name="Delete Car By ID")
def deleteCar(id: int):
    car = GetById(id)
    if(car):
        RemoveCar(id)
    return car

@routes.get("/download/{type}", name="Download Car in JSON or CSV file")
def downloadFile(type: str):
    cars = GetAll()
    if(type == "csv"):
        buffer = io.StringIO()
        writer = csv.DictWriter(buffer, fieldnames=list(Car.model_fields.keys()), delimiter=',')
        writer.writeheader()
        writer.writerows(cars)
        headers = { 
                   'Content-Disposition': 'attachment; filename="cars.csv"',
                   "Content-Type": "text/csv"
                }
        return StreamingResponse(buffer.getvalue(), headers=headers, media_type='text/csv')
    elif(type=="json"):
        headers = { 
                   'Content-Disposition': 'attachment; filename="cars.json"',
                   "Content-Type": "application/json"
                }
        return StreamingResponse(json_encode(cars), headers=headers, media_type='application/json')
    else:
        return None

    