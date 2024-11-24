import os
import sqlite3
import json
from .models import Car, DataFilterModel, CarAttributesEnum, CarResponse

DO_INIT = not not os.getenv("INIT_DB") == 'true'
FORCE_RESET_ON_INIT = os.getenv("FORCE_RESET_DB_ON_INIT") == 'true'
DB_NAME = os.getenv("SQLITE_DB_NAME")
TABLE_NAME = os.getenv("SQLITE_TABLE_NAME")
INIT_DATA_PATH = os.getenv("DB_INIT_DATA_PATH")

def getConnection():
    conn =  sqlite3.connect(DB_NAME)
    conn.row_factory = sqlite3.Row
    return conn

def initDB():
    print("######### Initializing Database #############\n")
    conn = getConnection()
    cursor = conn.cursor()
    if(FORCE_RESET_ON_INIT):
        print(f"0. FORCE RESET is set to true. Dropping Table {TABLE_NAME}")
        sql = f"DROP TABLE IF EXISTS {TABLE_NAME}"
        cursor.execute(sql)
        conn.commit()
        
    sql = "CREATE TABLE IF NOT EXISTS {}( \
                id INTEGER PRIMARY KEY, name TEXT NOT NULL, origin TEXT NOT NULL, \
                model_year INTEGER NOT NULL, cylinders INTEGER, mpg REAL, \
                horsepower REAL, weight REAL, acceleration REAL, displacement REAL \
            ) \
            STRICT".format(TABLE_NAME)
    cursor.execute(sql)
    print("1. Create Table If Not Exists Query Executed")
    
    print("2. Checking if there is already available data in the table")
    cursor.execute(f"SELECT * FROM {TABLE_NAME} LIMIT 1")
    car = cursor.fetchone()
    
    if(not car):
        print("3. Inserting Data into table")
        with open(INIT_DATA_PATH) as f:
            data = json.load(f)
            
            keys = ','.join(data[0].keys())
            bindings = ','.join([":"+k for k in data[0].keys()])
            sql = f"INSERT INTO {TABLE_NAME}({keys}) VALUES ({bindings})"
            for row in data:
                cursor.execute(sql, row)
            
            conn.commit()
        
        print("4. INSERT complete")
        print("5. confirming data insert")
        cursor.execute(f"SELECT * FROM {TABLE_NAME} LIMIT 1")
        car = cursor.fetchone()
        print(car)
    
    print("\n------Initialization Complete")
    conn.commit()
    conn.close()
    print()
    
def RunQuery(model: DataFilterModel) -> CarResponse:
    conn = getConnection()
    cursor = conn.cursor()
    
    select = f"SELECT * FROM {TABLE_NAME}"
    
    conditions = ""
    isSearch = len(model.search) > 0
    isFilter = len(model.filter) > 0
    if( isSearch or isFilter):
        conditions = "WHERE "
        if(isSearch):
            conditions+= f"(LOWER({CarAttributesEnum.NAME.value}) like '%{model.search.lower()}%' OR "
            conditions+= f"LOWER({CarAttributesEnum.ORIGIN.value}) like '%{model.search.lower()}%') AND "
        
        if(isFilter):
            conditions+="("
            for f in model.filter:
                conditions+= f"{f.field.value}{f.ops.value}{f.value} AND "
                
            conditions+="true)"  
        else:
            conditions+="true"      
    
    query = f"{select} {conditions} ORDER BY {model.orderBy.value} {model.order.value} LIMIT {model.limit} OFFSET {model.limit*model.page}"
    # print(query)
    cursor.execute(query)
    cars: list[Car] = [Car(**dict(row)) for row in cursor.fetchall()]
    
    query = f"select count(*) as total from ({select} {conditions})"
    cursor.execute(query)
    total = cursor.fetchone()['total']
    
    conn.close()    
    response: CarResponse = CarResponse(cars=cars, total=total)
    return response

def GetById(id: int) -> Car:
    conn = getConnection()
    cursor = conn.cursor()
    cursor.execute(f"SELECT * FROM {TABLE_NAME} WHERE id=:id", {"id": id})
    response = cursor.fetchone()
    conn.close()
    if(response):
        return Car(**dict(response))
    else:
        return None
    
def GetAll() -> list[Car]:
    conn = getConnection()
    cursor = conn.cursor()
    cursor.execute(f"SELECT * FROM {TABLE_NAME}")
    response = cursor.fetchall()
    conn.close()
    if(response):
        return [dict(row) for row in response]
    else:
        return []
    

def InsertCar(car: Car) -> int:
    data = car.model_dump()
    del data['id']
    
    keys = ','.join(data.keys())
    bindings = ','.join([":"+k for k in data.keys()])
    sql = f"INSERT INTO {TABLE_NAME}({keys}) VALUES ({bindings})"
    
    conn = getConnection()
    cursor = conn.cursor()
    cursor.execute(sql, data)
    id = cursor.lastrowid
    conn.commit()
    conn.close()
    return id
    
def UpdateCar(car: Car) -> None:
    data = car.model_dump()
    
    bindings = ','.join([f"{k}=:{k}" for k in data.keys()])
    sql = f"UPDATE {TABLE_NAME} SET {bindings} WHERE id=:id"
    # print(sql)
    
    conn = getConnection()
    cursor = conn.cursor()
    cursor.execute(sql, data)
    conn.commit()
    conn.close()
    
def RemoveCar(id: int) -> None:
    sql = f"DELETE FROM {TABLE_NAME} WHERE id=:id"
    conn = getConnection()
    cursor = conn.cursor()
    cursor.execute(sql, {"id":id})
    conn.commit()
    conn.close()

if __name__ == "__main__": 
    UpdateCar(Car(id=0, name="TestCar", origin="NPL", model_year=2024, acceleration=18,
                  horsepower=200, mpg=20, weight=500, cylinders=6, displacement=20))