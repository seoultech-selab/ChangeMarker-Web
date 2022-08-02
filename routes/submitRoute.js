const express = require('express');
const router = express.Router();

router.use('/', function(req, res, next) {
    const query = "insert into scripts_web (`user_code`,`type`,`old_code`,`line_number_old`,`start_pos_old`,`length_old`,`new_code`,`line_number_new`,`start_pos_new`,`length_new`,`change_id`, `route`) values (?);";
    let values = new Array();

    values.push(req.body.user_code);
    values.push(req.body.type);
    values.push(req.body.old_code);
    values.push(req.body.line_number_old == undefined ? undefined : Number(req.body.line_number_old));
    values.push(req.body.start_pos_old == undefined ? undefined : Number(req.body.start_pos_old));
    values.push(req.body.length_old == undefined ? undefined : Number(req.body.length_old));
    values.push(req.body.new_code);
    values.push(req.body.line_number_new == undefined ? undefined : Number(req.body.line_number_new));
    values.push(req.body.start_pos_new == undefined ? undefined : Number(req.body.start_pos_new));
    values.push(req.body.length_new == undefined ? undefined : Number(req.body.length_new));
    values.push(req.body.change_id);
    values.push(req.body.route);

    
    let mysql = require('mysql');
    let config = require('../db/db_info');
    let pool = mysql.createPool(config);

    pool.getConnection(function(err, conn) {
        if (!err) {
            conn.query(query, [values], (err, result) => {
                if (err) {
                    console.log(err);
                } else {
                    res.status(200).send({message : 'Submit success!!'});
                }
            })
        }
        conn.release();
    });
});

module.exports = router;