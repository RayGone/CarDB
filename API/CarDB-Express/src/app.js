require('dotenv').config()
const express = require('express');
const cors = require('cors');
const routes = require("./CarsRouter.js");

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

module.exports = app;
