const sqlite3 = require('sqlite3').verbose();

const getDBInstance = () => {
    const db = new sqlite3.Database(process.env.SQLITE_DB_NAME);
    return db;
}

const insertCar = (carObj, callback=(e, r)=>{}) => {
    const db = getDBInstance();
    const sql = `INSERT INTO ${process.env.SQLITE_TABLE_NAME} (${Object.keys(carObj).join(", ")}) VALUES (?,?,?,?,?,?,?,?,?)`;
    db.serialize(()=> db.run(sql, 
        Object.values(carObj), (e) => {
            if(e==null){                
                const q = `SELECT last_insert_rowid() as id`;
                db.get(q, [], callback)
            }else{
                callback(e, null)
            }
        }
    ));
}

const getLastRowId = (callback=(e, rowId)) => {
    const db = getDBInstance();
    const sql = `SELECT last_insert_rowid() as rowid`;
    db.serialize(() => db.get(sql, [], callback));
};

const updateCar = (carObj, callback=(e)=>{}) => {
    const db = getDBInstance();
    const sql = `UPDATE ${process.env.SQLITE_TABLE_NAME} SET `;
    Object.keys(carObj).forEach((key) => {
        if(key!='id'){
            sql+= `${key}=?, `;
        }
    })
    sql+=` id=? WHERE id=${carObje['id']}`;
    db.serialize(() => db.run(sql, Object.values(carObj), callback));
}

const deleteCar = (carId, callback=(e)=>{})=>{
    const db = getDBInstance();
    const sql = `DELETE FROM ${process.env.SQLITE_TABLE_NAME} WHERE id=?`;
    db.serialize(() => db.run(sql, carId, callback));
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
        db.run(sql, [], (err)=>{
            sql = "SELECT count(*) FROM ?";
            db.each(sql, process.env.SQLITE_TABLE_NAME, (err, row) => {
                if(row != null) {                
                    console.log("-- Empty Table; Filling with Initial Data");
                    const init_data = require("../data.json");
    
                    sql = `INSERT INTO ${process.env.SQLITE_TABLE_NAME} (${Object.keys(init_data[0]).join(", ")}) VALUES (?,?,?,?,?,?,?,?,?,?)`;
                    
                    for(let row of init_data){
                       insertCar(row,(err)=>{
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

function queryCar(filterModel, callback=(e,r)=>{}){
    let sql = `SELECT * FROM ${process.env.SQLITE_TABLE_NAME}`;

    let conditions = " ";


    const search = filterModel?.search;
    const isSearch = search && search!="" && search!=null;
    
    const filter = filterModel?.filter;
    const isModel = filter && filter?.length;
    
    if(isModel || isSearch){
        conditions += " WHERE";
    }

    if(isModel){
        let i=filter.length;
        for(let f of filter){
            conditions += ` ${f.field}${f.ops}${f.value}`;
            i-=1;
            if(i!=0 || isSearch) conditions += " AND";
        }
    }

    if(isSearch){
        search = (search+"").toLowerCase();
        conditions+=` (LOWER(name) like '%${search}%' OR LOWER(origin) like '%${search}%')`;
    }

    sql += conditions;

    if(filterModel?.orderBy){
        const order = (filterModel?.order ? filterModel?.order : 'asc').toUpperCase();
        sql += ` ORDER BY ${filterModel?.orderBy} ${order}`;
    }

    limit = filterModel?.limit ? filterModel?.limit : 20;
    sql += ` LIMIT ${limit}`;
    offset = filterModel?.page ? filterModel?.page * limit : 0;
    sql += ` OFFSET ${offset}`;

    const db = getDBInstance();
    db.serialize(() => {
        db.all(sql, [], (e,cars)=>{
            if(e!=null) console.log("Query Error:", e);
            if(cars==null) callback({}, {cars: [], total: 0});
            else{
                sql = "SELECT count(*) as total FROM "+process.env.SQLITE_TABLE_NAME+conditions;
                db.serialize(()=>{
                    db.get(sql, [], (err, count) =>{
                        if(err==null && count!=null){
                            callback(err, {cars: cars, total: count['total']});
                        }
                    });
                });
            }
        });
    });
}

module.exports = {getDBInstance, initDB, getLastRowId, queryCar, insertCar, updateCar, deleteCar}