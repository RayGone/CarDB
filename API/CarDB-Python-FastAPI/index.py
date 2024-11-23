from dotenv import load_dotenv
load_dotenv()

from fastapi import FastAPI
from resources import db

if(db.DO_INIT):
    db.initDB()

app = FastAPI()
# app.include_router(router)

@app.get("/")
async def root():
    return {"message": "Hello World"}

