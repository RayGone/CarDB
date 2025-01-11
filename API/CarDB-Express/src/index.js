require('dotenv').config()
const express = require('express');
const cors = require('cors');
const routes = require("./CarsRouter.js");

const PORT = process.env.PORT || 3000;
const app = express();

if(process.env.USE_API === "firestore"){
    const {connect, initData} = require("./firestore/db-init.js");
    connect(); // Initialize Firebase
    initData(); // Initialize data
}else{
    const {initDB} = require("./sqlite/db.js")
    initDB();
}

app.use(cors());
app.use(express.json());

app.use("/api/cars/", routes);

const { swaggerDocs } = require("./swagger");

app.listen(PORT, () => {
    console.log(`Server is running on http://localhost:${PORT}`);
    swaggerDocs(app, PORT);
});
