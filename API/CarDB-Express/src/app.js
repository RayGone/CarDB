require('dotenv').config()
const express = require('express');
const cors = require('cors');
const routes = require("./CarsRouter.js");
const helmet = require('helmet');

const app = express();

if(process.env.USE_API === "firestore"){
    const {connect, initData} = require("./firestore/db-init.js");
    connect(); // Initialize Firebase
    initData(); // Initialize data
}else{
    const {initDB} = require("./sqlite/db.js")
    initDB();
}
app.use(helmet.contentSecurityPolicy())
app.use(helmet.dnsPrefetchControl())
app.use(helmet.crossOriginEmbedderPolicy())
app.use(helmet.frameguard())
app.use(helmet.hidePoweredBy())
app.use(helmet.hsts())
app.use(helmet.ieNoOpen())
app.use(helmet.noSniff())
app.use(helmet.permittedCrossDomainPolicies())
app.use(helmet.referrerPolicy())
app.use(helmet.xssFilter())
app.use(helmet.originAgentCluster())
app.use(helmet.crossOriginResourcePolicy({ policy: 'cross-origin' }))
app.use(helmet.crossOriginOpenerPolicy())

let whitelist = ['http://localhost:4200'];

if(process.env.APP_ENV == 'prod'){
    whitelist = ['https://angular-app.sushmaregan.com']
}

const corsOptions = { 
    origin: function (origin, callback) 
    { 
        if (whitelist.indexOf(origin) !== -1 || !origin) 
        { 
            callback(null, true); 
        } 
        else 
        { 
            callback(new Error('Not allowed by CORS')); 
        } 
    } 
};

app.use(cors(corsOptions));
app.use(express.urlencoded({ limit: '50mb', extended: true }))
app.use(express.json({limit: '50mb'}));

app.use("/api/cars/", routes);

module.exports = app;
