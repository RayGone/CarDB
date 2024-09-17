const express = require('express');
const {connect, initData} = require("./db-init.js");

const routes = require("./router.js");

const PORT = 3000;
const app = express();

connect(); // Initialize Firebase
initData(); // Initialize data

app.use(express.json());
app.use("/api/", routes);

// const { swaggerDocs } = require("./swagger");

app.listen(PORT, () => {
    console.log(`Server is running on http://localhost:${PORT}`);
    // swaggerDocs(app, PORT);
});
