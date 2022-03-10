const express = require('express')
const path = require('path');
const routes = require('./routes/api');

const app = express()
const server = require('http').Server(app);

/* Routes */
app.use('/api', routes);

/* Serve React app */
app.use(express.static(path.join(__dirname, './build')));
app.get(['/*'], function (req, res) {
    res.sendFile(path.join(__dirname, './build', 'index.html'));
});

module.exports = server;
