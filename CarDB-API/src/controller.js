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

module.exports = { getCars, searchCars, getTotalCars };