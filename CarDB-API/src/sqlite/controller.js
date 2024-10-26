const {getDBInstance, queryCar, insertCar, updateCar, removeCar} = require("./db");
const db = getDBInstance();

/*
 * =================================================================================================
 * Get Cars Controller
 */
const getCars = async (req, res) => {  
    if(Object.keys(req.query).length > 0){       
        queryCar({...req.query},(e,r)=>{
            if(e!=null) res.status(500).send(e);
            else if (r==null) res.json({cars:[],total:0});
            else res.json(r);
        });
    }else {
        queryCar(req.body,(e,r)=>{
            if(e!=null) res.status(500).send(e);
            else if (r==null) res.json({cars:[],total:0});
            else res.json(r);
        });
    }
}

/*
 * =================================================================================================
 * Get Cars Count Controller
 */
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

/*
 * =================================================================================================
 * Add Cars Controller
 */
const addCars = (req, res) => {
    data = {...req.body};
    insertCar(data, (e, r)=>{
        if(e==null){
            res.json(r);
        }
        else{
            console.log("Insert Error", e);
            res.status(500).send("Internal Server Error");
        }
    });
}

/*
 * =================================================================================================
 * Edit Cars Controller
 */
const editCars = (req, res) => {
    const data = {...req.body};
    const id = parseInt(req.params.id);

    updateCar(data, (e, r)=>{
        if(e==null){
            res.json({id: r.id});
        }
        else{
            console.log("Update Error", e);
            res.status(500).send("Internal Server Error");
        }
    });
}

/*
 * =================================================================================================
 * De;ete Cars Controller
 */
const deleteCars = (req, res) => {
    const data = {...req.body};
    const id = parseInt(req.params.id);

    removeCar(id, (e)=>{
        if(e==null){
            res.json({id: id});
        }
        else{
            console.log("Delete Error", e);
            res.status(500).send("Internal Server Error");
        }
    });
}


module.exports = {getCars, getTotalCars, addCars, editCars, deleteCars}