import os
from dotenv import load_dotenv
load_dotenv()

CORS_ORIGINS = [
    "http://localhost:3030",
    "http://localhost:4200/"
]

from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from resources import db
from Router import router

if(db.DO_INIT):
    db.initDB()

app = FastAPI()
app.include_router(router)
app.add_middleware(
    CORSMiddleware,
    allow_origins=CORS_ORIGINS,
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

