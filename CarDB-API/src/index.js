const express = require('express');
const {init, collectionName} = require("./db-init.js");

const port = 3000;
var db_context;

const app = express();
app.use(express.json());

init();

app.get('/', (req, res) => {
    res.send('Hello World!');
});

app.listen(port, () => {
    console.log(`Server is running on http://localhost:${port}`);
});
