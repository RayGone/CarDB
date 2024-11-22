from fastapi import FastAPI
from dotenv import load_dotenv
from resources import db

load_dotenv()

app = FastAPI()
# app.include_router(router)

@app.get("/")
async def root():
    return {"message": "Hello World"}

