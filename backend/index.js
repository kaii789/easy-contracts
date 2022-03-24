const express = require('express');
const Sentry = require('@sentry/node');
const path = require('path');
const cors = require('cors');
const bodyParser = require('body-parser');
const routes = require('./routes/api');

const app = express();
const server = require('http').Server(app);


Sentry.init({ dsn: process.env.SENTRY_DSN });

// The request handler must be the first middleware on the app
app.use(Sentry.Handlers.requestHandler());


/* Misc */
app.use(bodyParser.json());
app.use(cors());

/* Datastore */
let mongoURL = process.env.DB_URI;
if (mongoURL === null || mongoURL === undefined) {
    // Use localhost db.
    mongoURL = 'mongodb://blocx-datastore:27017/blocx';
}

const mongoose = require('mongoose');
mongoose.connect(mongoURL,{ useNewUrlParser: true, useUnifiedTopology: true})
    .then(() => console.log("Database Connected Successfully"))
    .catch(err => console.log(err));

/* Routes */
app.use('/api', routes);

/* Serve React app */
if (process.env.DEV_ENV == null || !process.env.DEV_ENV) {
    app.use(express.static(path.join(__dirname, './build')));
    app.get(['/*'], function (req, res) {
        res.sendFile(path.join(__dirname, './build', 'index.html'));
    });
}


// The error handler must be before any other error middleware and after all controllers
app.use(Sentry.Handlers.errorHandler());

module.exports = server;
