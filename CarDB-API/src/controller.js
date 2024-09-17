const {connect, collectionName, getDbContext} = require("./db-init.js");

const default_limit = 20;

getCars = (req, res) => {
    const db_context = getDbContext();

    limit = default_limit;
    page = 0;
    if(req.query.limit) limit = parseInt(req.query.limit);
    if(req.query.page) page = parseInt(req.query.page);

    db_context.collection(collectionName).orderBy("id").startAt(page*limit).limit(limit).get()
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

getTotalCars = (req, res) => {
    const db_context = getDbContext();
    db_context.collection(collectionName).count().get().then(snapshot => {
        count = snapshot.data().count;
        res.json({ total: count });
    });
};

module.exports = { getCars, getTotalCars };