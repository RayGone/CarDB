const {connect, collectionName, getDbContext} = require("./db-init.js");
const fs = require('fs');
const converter = require('json-2-csv');
// const csv = await converter.json2csv(data, options);

const default_limit = 20;
const default_page = 0;
const default_orderBy = "id";
const default_order = "asc";

checkConditions = (car, filter) => {
    if(filter.ops == "==") return car[filter.field] == filter.value;
    if(filter.ops == "!=") return car[filter.field] != filter.value;
    if(filter.ops == ">") return car[filter.field] > filter.value;
    if(filter.ops == "<") return car[filter.field] < filter.value;
    if(filter.ops == ">=") return car[filter.field] >= filter.value;
    if(filter.ops == "<=") return car[filter.field] <= filter.value;
    return false;
};

local_db = [];

/*
 * =================================================================================================
 * Get Cars Controller
 */
getCars = (req, res) => {
    const db_context = getDbContext();
    collection = db_context.collection(collectionName);

    limit = default_limit;
    page = default_page;
    orderBy = default_orderBy;
    order = default_order;
    search = "";
    filters = [];

    //---
    if(req.query.order) order = req.query.order;
    else if(req.body.order) order = req.body.order;

    if(req.query.orderBy) orderBy = req.query.orderBy;
    else if(req.body.orderBy) orderBy = req.body.orderBy;

    //---
    if(req.query.limit) limit = parseInt(req.query.limit);
    else if(req.body.limit) limit = parseInt(req.body.limit);

    if(req.query.page) page = parseInt(req.query.page);
    else if(req.body.page) page = parseInt(req.body.page);

    //---
    if(req.query.search) search = req.query.search;
    else if(req.body.search) search = req.body.search;
    search = search.toLowerCase();

    //---
    if(req.body.filter) filters = req.body.filter;

    /**
     * 
     */
    if(process.env.FIRESTORE_API_USE_LOCAL_DB == true){
        if(local_db.length == 0){    
            let query = collection.orderBy(orderBy, order)       
            query.get().then(snapshot => {
                total = parseInt(snapshot.size);
                let cars = [];
                snapshot.forEach(doc => {
                    data = doc.data();
                    cars.push(data);
                });

                local_db = [...cars];            

                //===================
                // Approach 2 ==> Instead Using JS Filter
                //=== Requires Fetching All the data from Firestore ===
                //===== Unneccessary Read of whole collecton ===========
                // --searching;
                if(search != ""){
                    cars = cars.filter((car) => {
                        const name = car.name ? (car.name + "").toLowerCase() : "";
                        const origin = car.origin ? (car.origin + "").toLowerCase() : "";
                        return (name.includes(search) || origin.includes(search))
                    });
                }

                // --filtering;
                if(filters.length > 0){
                    cars = cars.filter(car => filters.every(filter => checkConditions(car, filter)));
                }
                total = cars.length;

                // --limiting;
                cars = cars.slice(page*limit, (page+1)*limit);
                //======== Approach 2 End ===========
                
                res.json({cars: cars, total: total});
            })
            .catch(err => {
                console.error(err);
                res.status(500).send("Internal Server Error");
            });
            return;
        }

        else{
            //===================
            // Approach 3 ==> Local Cache of the DB
            //=== Requires Fetching All the data from Firestore Once ===
            cars = [...local_db];

            // --sorting;
            cars.sort((carA, carB) => {
                if(carA[orderBy] === carB[orderBy]) return 0;
                const cond = order === "asc" ? carA[orderBy] > carB[orderBy] : carA[orderBy] < carB[orderBy];
                return cond ? 1 : -1;
            });
    
            // --searching;
            if(search != ""){
                cars = cars.filter((car) => {
                    const name = car.name ? (car.name + "").toLowerCase() : "";
                    const origin = car.origin ? (car.origin + "").toLowerCase() : "";
                    return (name.includes(search) || origin.includes(search))
                });
            }
    
            // --filtering;
            if(filters.length > 0){
                cars = cars.filter(car => filters.every(filter => checkConditions(car, filter)));
            }
            total = cars.length;
    
            // --limiting;
            cars = cars.slice(page*limit, (page+1)*limit);
    
            res.json({cars: cars, total: total});
            return;
        }
    }

    //===================
    // Approach 1 ==> Using where clause
    //=== Requires Setting Up Indexes in Firestore ===
    //===== Also Firestore Doesn't Allow Pattern Matching 
    //      So can't perform global search =================
    // --sorting;
    let query = collection.orderBy(orderBy, order)
    // query = query.limit(50); // Note: Remove when testing is done
    filters.forEach(filter => {
        query = query.where(filter.field, filter.ops, filter.value);
    });

    query.get().then(snapshot => {
        const count = snapshot.size;

        query.startAt(page*limit).endAt((page+1)*limit);
        query = query.limit(limit);

        query.get().then(snapshot => {
            let cars = [];
            snapshot.forEach(doc => {
                cars.push(doc.data());
            });
            res.json({cars: cars, total: count});
            return;
        });
    });
};

/*
 * =================================================================================================
 * Get Cars Count Controller
 */
getTotalCars = (req, res) => {
    if(local_db.length > 0) {        
        res.json({ total: local_db.length });
        return;
    }
    const db_context = getDbContext();
    db_context.collection(collectionName).count().get().then(snapshot => {
        count = snapshot.data().count;
        res.json({ total: count });
    });
};

/*
 * =================================================================================================
 * Download Cars Controller
 */
download = (req, res) => {
    const db_context = getDbContext();
    db_context.collection(collectionName).get().then(snapshot => {
        ftype = "json"
        if(req.params.type) ftype = req.params.type
        else if(req.query.type) ftype = req.query.type
       
        let cars = [];
        snapshot.forEach(doc => {
            cars.push(doc.data());
        });

        data = "";
        filepath = "";
        if(ftype == "csv"){
            data = converter.json2csv(cars)
            filepath = 'cars.csv';
        }else{
            // ftype == "json"
            data = JSON.stringify(cars, null, 2);
            filepath = 'cars.json';
        }

        if(data == "" || filepath == ""){
            res.status(500).send("Internal Server Error 1");
            return;
        } else{   
            try {
                // Write JSON string to a file
                fs.writeFile(filepath, data, (err) => {
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
    });
}

/*
 * =================================================================================================
 * Add Cars Controller
 */
addCars = (req, res) => {
    const db_context = getDbContext();
    db_context.collection(collectionName).orderBy(default_orderBy, 'desc').limit(1).get().then(snapshot => {
        doc_id = 0;
        snapshot.forEach(doc => {
            doc_id = doc.id;
        });
        doc_id = parseInt(doc_id) + 1;

        var data = {
            ...req.body,
            id: doc_id
        }

        db_context.collection(collectionName).doc(doc_id.toString()).set(data)
            .then(ref => {
                local_db.push(data);
                res.json({ id: ref.id });
            }).catch(err => {
                console.error(err);
                res.status(500).send("Internal Server Error");
            });
    }).catch(err => {
        console.error(err);
        res.status(500).send("Internal Server Error");
    });
}

/*
 * =================================================================================================
 * Edit Cars Controller
 */
editCars = (req, res) => {
    const db_context = getDbContext();
    const id = parseInt(req.params.id);
    const data = req.body

    // Though the doc Id and object Id are same, here is just a failsafe procedure.
    db_context.collection(collectionName).where("id", "==", id).get().then(snapshot => {
        if(snapshot.size == 0){
            res.status(404).send("Not Found");
            return;
        }

        const doc_id = snapshot.docs[0].id;
        db_context.collection(collectionName).doc(doc_id).set(data)
            .then(ref => {
                local_db = local_db.filter((car) => car.id!=data.id);
                local_db.push(data);

                res.json({ id: ref.id });
            }).catch(err => {
                console.error(err);
                res.status(500).send("Internal Server Error 1");
            });
    }).catch(err => {
        console.error(err);
        res.status(500).send("Internal Server Error 2");
    });
};

/*
 * =================================================================================================
 * Delete Cars Controller
 */
deleteCars = (req, res) => {
    const id = parseInt(req.params.id);
    const db_context = getDbContext();

    // Though the doc Id and object Id are same, here is just a failsafe procedure.
    db_context.collection(collectionName).where("id", "==", id).get().then(snapshot => {
        if(snapshot.size == 0){
            res.status(404).send("Not Found");
            return;
        }
        const doc_id = snapshot.docs[0].id;
        db_context.collection(collectionName).doc(doc_id).delete().then(ref => {
            local_db = local_db.filter((car) => car.id!=id);
            res.json({ id: id });
        }).catch(err => {
            console.error(err);
            res.status(500).send("Internal Server Error 1");
        });
    }).catch(err => {
        console.error(err);
        res.status(500).send("Internal Server Error 2");
    });;

    

}

module.exports = { getCars, getTotalCars, addCars, editCars, deleteCars, download };