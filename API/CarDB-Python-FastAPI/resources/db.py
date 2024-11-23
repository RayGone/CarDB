import os
import sqlite3
import json

DO_INIT = not not os.getenv("INIT_DB") == 'true'
FORCE_RESET_ON_INIT = os.getenv("FORCE_RESET_DB_ON_INIT") == 'true'
DB_NAME = os.getenv("SQLITE_DB_NAME")
TABLE_NAME = os.getenv("SQLITE_TABLE_NAME")
INIT_DATA_PATH = os.getenv("DB_INIT_DATA_PATH")

def initDB():
    print("######### Initializing Database #############\n")
    conn = sqlite3.connect(DB_NAME)
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