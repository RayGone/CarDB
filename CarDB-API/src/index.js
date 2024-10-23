require('dotenv').config()
const express = require('express');
const cors = require('cors');
const {connect, initData} = require("./firestore/db-init.js");
const routes = require("./firestore/router.js");

const PORT = process.env.PORT || 3000;
const app = express();

connect(); // Initialize Firebase
initData(); // Initialize data

app.use(cors());
app.use(express.json());
app.use("/api/", routes);

// const { swaggerDocs } = require("./swagger");

app.listen(PORT, () => {
    console.log(`Server is running on http://localhost:${PORT}`);
    // swaggerDocs(app, PORT);
});
