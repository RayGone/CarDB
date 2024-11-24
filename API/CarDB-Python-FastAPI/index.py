from dotenv import load_dotenv
load_dotenv()

from fastapi import FastAPI
from resources import db
from Router import router

if(db.DO_INIT):
    db.initDB()

app = FastAPI()
app.include_router(router)

