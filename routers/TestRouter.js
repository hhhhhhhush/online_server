const express = require('express')
const router = express.Router()
const { db } = require('../db/DbUtils')

router.get('/test', (req, res) => {
    db.all("select * from `admin`", [], (err, rows) => {
        if (err) {
            console.error(err);
            res.status(500).send("Internal Server Error");
        } else {
            console.log(rows);
            // res.send(rows);
        }
    });
    res.send("test")
});


module.exports = router;