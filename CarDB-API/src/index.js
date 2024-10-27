require('dotenv').config()
const express = require('express');
const cors = require('cors');
const {connect, initData} = require("./firestore/db-init.js");
const {initDB} = require("./sqlite/db.js")
const fire_routes = require("./firestore/router.js");
const sqlite_routes = require("./sqlite/router.js");

const PORT = process.env.PORT || 3000;
const app = express();

const routes = process.env.USE_API === "firestore" ? fire_routes : sqlite_routes;

if(process.env.USE_API === "firestore"){
    connect(); // Initialize Firebase
    initData(); // Initialize data
}else{
    initDB();
}

app.use(cors());
app.use(express.json());

app.use("/api/", routes);

const { swaggerDocs } = require("./swagger");

app.listen(PORT, () => {
    console.log(`Server is running on http://localhost:${PORT}`);
    swaggerDocs(app, PORT);
});
