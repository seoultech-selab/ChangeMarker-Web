const express = require('express');
const router = express.Router();

router.use('/', function(req, res, next) {
    let mysql = require('mysql');
    let config = require('../db/db_info');
    let pool = mysql.createPool(config);

    pool.getConnection(function(err, conn) {
        if (!err) {
            let query = "INSERT INTO cmw_participants values('";
            query += req.body.user_code;
            query += "', '";
            query += req.body.email;
            query += "', '";
            query += req.body.job;
            query += "');";
            conn.query(query, (err, result) => {
                if (err) {
                    console.log(err);
                } else {
                    res.status(200).send({message : 'Delete success!!'});
                }
            })
        }
        conn.release();
    });
});

module.exports = router;