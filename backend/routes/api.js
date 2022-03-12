const express = require('express');
const router = express.Router();

router.get('/', (req, res) => {
    res.send('Hello World!');
    throw new Error("Someone visited the \'/api/\' route!");
});

module.exports = router;
