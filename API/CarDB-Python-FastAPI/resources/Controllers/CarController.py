from fastapi import APIRouter, Request, Depends, HTTPException
from ..models import DataFilterModel, OrderEnum, CarAttributesEnum
from ..db import runQuery


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
    return runQuery(filterModel)


@routes.post("/filterSearch", name="Get Filtered Car")
def getCar(filterModel: DataFilterModel = Depends(filterMapper)):
    return runQuery(filterModel)