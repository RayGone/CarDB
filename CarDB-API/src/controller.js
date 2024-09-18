const {connect, collectionName, getDbContext} = require("./db-init.js");

const default_limit = 20;
const default_page = 0;
const default_orderBy = "id";
const default_order = "asc";

getCars = (req, res) => {
    const db_context = getDbContext();
    collection = db_context.collection(collectionName);

    limit = default_limit;
    page = default_page;
    orderBy = default_orderBy;
    order = default_order;
    filters = [];

    if(req.query.order) order = req.query.order;
    else if(req.body.order) order = req.body.order;

    if(req.query.orderBy) orderBy = req.query.orderBy;
    else if(req.body.orderBy) orderBy = req.body.orderBy;

    if(req.query.limit) limit = parseInt(req.query.limit);
    else if(req.body.limit) limit = parseInt(req.body.limit);

    if(req.query.page) page = parseInt(req.query.page);
    else if(req.body.page) page = parseInt(req.body.page);

    if(req.body.filter) filters = req.body.filter;

    query = collection.orderBy(orderBy, order);

    filters.forEach(filter => {
        query = query.where(filter.field, filter.ops, filter.value);
    });

    query = query.startAt(page*limit);
    query = query.limit(limit);


    query.get()
        .then(snapshot => {
            let cars = [];
            snapshot.forEach(doc => {
                cars.push(doc.data());
            });
            res.json(cars);
        })
        .catch(err => {
            console.error(err);
            res.status(500).send("Internal Server Error");
        });
};

searchCars = (req, res) => {res.send("searchCars")};

getTotalCars = (req, res) => {
    const db_context = getDbContext();
    db_context.collection(collectionName).count().get().then(snapshot => {
        count = snapshot.data().count;
        res.json({ total: count });
    });
};

download = (req, res) => {
    db_context.collection(collectionName).get().then(snapshot => {
        let cars = [];
        snapshot.forEach(doc => {
            cars.push(doc.data());
        });
    });
}

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
        console.log({data});

        db_context.collection(collectionName).doc(doc_id.toString()).set(data)
            .then(ref => {
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

module.exports = { getCars, searchCars, getTotalCars, addCars, editCars, deleteCars, download };