const {getDBInstance, queryCar, insertCar, updateCar, removeCar} = require("./db");
const fs = require('fs');
const converter = require('json-2-csv');

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
    
    if(data.name === "") res.status(400).send("Required field 'name' not provided");
    else if(data.origin === "") res.status(400).send("Required field 'origin' not provided");
    else if(data.model_year === "") res.status(400).send("Required field 'model_year' not provided");
    else{
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
}

/*
 * =================================================================================================
 * Edit Cars Controller
 */
const editCars = (req, res) => {
    const data = {...req.body};
    const id = parseInt(req.params.id);

    if(typeof id != "number") res.status(400).send("valid ID required in URL");
    else if(data.name === "") res.status(400).send("Required field 'name' not provided");
    else if(data.origin === "") res.status(400).send("Required field 'origin' not provided");
    else if(data.model_year === "") res.status(400).send("Required field 'model_year' not provided");
    else{
        updateCar(data, (e)=>{
            if(e==null){
                res.json({id: id});
            }
            else{
                console.log("Update Error", e);
                res.status(500).send("Internal Server Error");
            }
        });
    }
}

/*
 * =================================================================================================
 * Delete Cars Controller
 */
const deleteCars = (req, res) => {
    const id = parseInt(req.params.id);

    if(typeof id != "number") res.status(400).send("valid ID required in URL");
    else{
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
}

/*
 * =================================================================================================
 * Download Cars Controller
 */
const download = (req, res) => {
    ftype = "json"
    if(req.params.type) ftype = req.params.type
    else if(req.query.type) ftype = req.query.type

    queryCar({all: true}, (e, r)=>{
        if(e==null){
            console.log("Download: Query Complete", ftype)
            let outdata = "";
            let filepath = "";
            if(ftype==='json'){
                outdata = JSON.stringify(r);
                filepath = "cars.json"
            }else{
                outdata = converter.json2csv(r);
                filepath = "cars.csv"
            }

            try {
                // Write data string to a file
                fs.writeFile(filepath, outdata, (err) => {
                    if (err) {
                        return res.status(500).send('Error writing file');
                    }
                
                    // Send the file as a download
                    res.download(filepath, filepath, (err) => {
                        if (err) {
                            return res.status(500).send('Error downloading file');
                        }
              
                        // Optionally, delete the file after sending it
                        fs.unlink(filepath, (err) => {
                            if (err) {
                                console.error('Error deleting file:', err);
                            }
                        });
                    });
                });
            } catch (err) {
                console.error('Error writing file:', err);
                res.status(500).send("Internal Server Error 2");
            }
        }
        else{
            console.log("Download Error", e);
            res.status(500).send("Internal Server Error");
        }
    });
}


module.exports = {getCars, getTotalCars, addCars, editCars, deleteCars, download}