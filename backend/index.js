const express = require('express')
const path = require('path');
const cors = require('cors');
const bodyParser = require('body-parser');
const routes = require('./routes/api');

const app = express()
const server = require('http').Server(app);

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
app.use(express.static(path.join(__dirname, './build')));
app.get(['/*'], function (req, res) {
    res.sendFile(path.join(__dirname, './build', 'index.html'));
});

module.exports = server;
