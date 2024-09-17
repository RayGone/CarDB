const {connect, collectionName, getDbContext} = require("./db-init.js");

const default_limit = 20;
getCars = (req, res) => {
    const db_context = getDbContext();

    limit = default_limit;
    if(req.query.limit) limit = parseInt(req.query.limit);

    db_context.collection(collectionName).limit(limit).get()
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

module.exports = { getCars };