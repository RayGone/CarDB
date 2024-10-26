const {getDBInstance, queryCar} = require("./db");
const db = getDBInstance();

const getCars = async (req, res) => {  
    if(Object.keys(req.query).length > 0){       
        queryCar({...req.query},(e,r)=>{
            if(e!=null) res.status(500).send(e);
            else if (r==null) res.json({cars:[],total:0});
            else res.json(r);
        });
    }else     
        queryCar(req.body,(e,r)=>{
            if(e!=null) res.status(500).send(e);
            else if (r==null) res.json({cars:[],total:0});
            else res.json(r);
        });
}

const getTotalCars = (req, res) => {
    const db = getDBInstance();
    db.get("SELECT count(*) as total FROM "+process.env.SQLITE_TABLE_NAME, (err, row) =>{
        if(res!=null){
            // console.log({row})
            res.json({ total: row['total']});
        }else{         
            res.status(500).send("error")
        }
    });
};


module.exports = {getCars, getTotalCars}