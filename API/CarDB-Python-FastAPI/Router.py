from fastapi import APIRouter
from resources.Controllers import CarController

router = APIRouter()

router.include_router(CarController.routes)

