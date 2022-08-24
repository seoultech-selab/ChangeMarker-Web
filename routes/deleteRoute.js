const express = require('express');
const router = express.Router();

router.use('/', function(req, res, next) {
    let mysql = require('mysql');
    let config = require('../db/db_info');
    let pool = mysql.createPool(config);

    if (!req.body) {
        res.status(500).send();
        return;
    }

    pool.getConnection(function(err, conn) {
        if (!err) {
            let query = "DELETE FROM scripts_web where `user_code`='";

            if (!req.body.user_code) {
                res.status(500).send();
                if (conn) conn.release();
                return;
            }

            query += req.body.user_code;
            query += "' and `type`='";

            if (!req.body.type) {
                res.status(500).send();
                if (conn) conn.release();
                return;
            }

            query += req.body.type;
            if (req.body?.length_old != 0) {
                query += "' and `length_old`='";
                query += req.body.length_old;
            }
            if (req.body?.line_number_old?.length != 0) {
                query += "' and `line_number_old`='";
                query += req.body.line_number_old;
            }
            if (req.body?.length_new != 0) {
                query += "' and `length_new`='";
                query += req.body.length_new;
            }
            if (req.body?.line_number_new != 0) {
                query += "' and `line_number_new`='";
                query += req.body.line_number_new;
            }
            query += "' and `change_id`='";

            if (!req.body.change_id) {
                res.status(500).send();
                if (conn) conn.release();
                return;
            }
            query += req.body.change_id;
            query += "';"
            conn.query(query, (err, result) => {
                if (err) {
                    res.status(500).send(err);
                } else {
                    res.status(200).send({message : 'Delete success!!'});
                }
            })
        }
        if (conn) conn.release();
    });
});

module.exports = router;