const express = require('express');
require('express-async-errors');
const app = express();
const bp = require('body-parser');



require('dotenv').config({ path: process.cwd() + '/config/.env' });

app.use(bp.json());

const routes = require('./route/route');

const db = require('./config/db.config');

const error = require('./middleware/error');

//DB Population Section

db.sequelize
    .authenticate().then(function (err) {
        console.log('Connection has been established successfully.');
        db.sequelize.sync({
            force: true
        });

    }).catch(function (err) {
        console.log("Problem while connecting to db");
        throw err;
    });

app.use('/',routes);

app.use(error);

app.listen(process.env.PORT, function () {
    console.log("Server started on http://localhost:3100");
});

