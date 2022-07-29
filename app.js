/** import express module */
const express = require('express');
/** create app instance */
const app = express();
/** import mongoose */
const {default: mongoose} = require('mongoose');
/** import routers initializer */
const {initializeRouters} = require("./app/routes");
/** import swagger initializer */
const {initializeSwagger} = require("./app/conf/initSwagger");
/** import system config */
const config = require("./app/conf/config");
/** import error handler */
const {errorHandler} = require("./app/middleware/errors");

/** define server port */
const PORT = config.PORT;
/** define MongoDB url */
const MongoURL = config.MongoURL

/** initialize express bodyparser module */
app.use(express.urlencoded({extended: false}));
app.use(express.json({type: 'application/json'}));

mongoose.connect(MongoURL).then(() => {
    console.log("database connected")

    /** starting application */
    app.listen(PORT, () => {
        console.log(`run > http://localhost:${PORT}`);
    });
    /** Initialize routers */
    initializeRouters(app);
    /** initialize swagger */
    initializeSwagger(app);
    /** initialize error handler */
    app.use(errorHandler);
}).catch((error) => {
    console.log("database connection error")
    console.log(error)
    process.exit(1);
});