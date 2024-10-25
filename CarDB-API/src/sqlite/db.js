const sqlite3 = require('sqlite3').verbose();

const getDBInstance = () => {
    const db = new sqlite3.cached.Database(process.env.SQLITE_DB_NAME);
    return db;
}

const initDB = () => {
    console.log("Initializing Database -----");
    const db = getDBInstance();
    db.serialize(() => {
        console.log("-- Creating Table");
        let sql = `CREATE TABLE IF NOT EXISTS ${process.env.SQLITE_TABLE_NAME}(
                id INTEGER PRIMARY KEY, name TEXT NOT NULL, origin TEXT NOT NULL, 
                model_year INTEGER NOT NULL, cylinders INTEGER, mpg REAL, 
                horsepower REAL, weight REAL, acceleration REAL, displacement REAL
            )
            STRICT`;
        db.run(sql, (err)=>{
            sql = "SELECT count(*) FROM ?";
            db.each(sql, process.env.SQLITE_TABLE_NAME, (err, row) => {
                if(row != null) {                
                    console.log("-- Empty Table; Filling with Initial Data");
                    const init_data = require("../data.json");
    
                    sql = `INSERT INTO ${process.env.SQLITE_TABLE_NAME} (${Object.keys(init_data[0]).join(", ")}) VALUES (?,?,?,?,?,?,?,?,?,?)`;
                    
                    for(let row of init_data){
                        db.run(sql, Object.values(row), (err)=>{
                            if(err!=null) console.log("Error Occurred", err, sql, row);
                        });
                    }
                }
                
        
                console.log("Database SetUp ---");
                db.close();
            });

        });
    });
}

function query(filterModel, callback=(e,r)=>{}){
    let sql = `SELECT * FROM ${process.env.SQLITE_TABLE_NAME}`;

    search = filterModel?.search;
    if(filterModel?.filter.length > 0 || search!=""){
        sql += " WHERE";

        let i=filterModel?.filter.length;
        for(let filter of filterModel?.filter){
            sql += ` ${filter.field}${filter.ops}${filter.value}`;
            i-=1;
            if(i!=0 || search) sql += " AND";
        }

        if(search!="" || search!=null){
            search = (search+"").toLowerCase();
            sql+=` (LOWER(name) like '%${search}%' OR LOWER(origin) like '%${search}%')`;
        }
    }

    if(filterModel?.orderBy){
        const order = filterModel?.order ? filterModel?.order : 'asc';
        sql += ` ORDER BY ${filterModel?.orderBy} ${order}`;
    }

    limit = filterModel?.limit ? filterModel?.limit : 20;
    sql += ` LIMIT ${limit}`;
    offset = filterModel?.page ? filterModel?.page * limit : 0;
    sql += ` OFFSET ${offset}`;

    console.log(sql)
    const db = getDBInstance();
    db.all(sql, callback);
}

module.exports = {getDBInstance, initDB, query}