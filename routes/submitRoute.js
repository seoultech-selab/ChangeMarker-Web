const express = require('express');
const router = express.Router();
const db = require('../src/global/db/dbPoolCreator');

function isNullOrUndefined(o) {
    return o == null || o == undefined;
}

router.use('/', async  function(req, res, next) {
    const query = "insert into scripts_web (`user_code`,`type`,`old_code`,`line_number_old`,`start_pos_old`,`length_old`,`new_code`,`line_number_new`,`start_pos_new`,`length_new`,`change_id`, `route`, `created_at`) values (?);";
    let values = new Array();

    if (isNullOrUndefined(req.body.user_code) || 
        isNullOrUndefined(req.body.type) ||
        isNullOrUndefined(req.body.change_id) || 
        (isNullOrUndefined(req.body.old_code) && isNullOrUndefined(req.body.new_code)) ||
        isNullOrUndefined(req.body.route) || 
        isNullOrUndefined(req.body.created_at)) {

        res.status(500).send();
        return;
    }

    values.push(req.body.user_code);
    values.push(req.body.type);
    values.push(req.body.old_code);
    values.push(isNullOrUndefined(req.body.line_number_old) ? undefined : Number(req.body.line_number_old));
    values.push(isNullOrUndefined(req.body.start_pos_old) ? undefined : Number(req.body.start_pos_old));
    values.push(isNullOrUndefined(req.body.length_old) ? undefined : Number(req.body.length_old));
    values.push(req.body.new_code);
    values.push(isNullOrUndefined(req.body.line_number_new) ? undefined : Number(req.body.line_number_new));
    values.push(isNullOrUndefined(req.body.start_pos_new) ? undefined : Number(req.body.start_pos_new));
    values.push(isNullOrUndefined(req.body.length_new) ? undefined : Number(req.body.length_new));
    values.push(req.body.change_id);
    values.push(req.body.route);
    values.push(req.body.created_at);

    if ((!isNullOrUndefined(req.body.line_number_old) && isNaN(Number(req.body.line_number_old))) ||
        (!isNullOrUndefined(req.body.start_pos_old) && isNaN(Number(req.body.start_pos_old))) ||
        (!isNullOrUndefined(req.body.length_old) && isNaN(Number(req.body.length_old))) ||
        (!isNullOrUndefined(req.body.line_number_new) && isNaN(Number(req.body.line_number_new))) ||
        (!isNullOrUndefined(req.body.start_pos_new) && isNaN(Number(req.body.start_pos_new))) ||
        (!isNullOrUndefined(req.body.length_new) && isNaN(Number(req.body.length_new)))) {
        
        res.status(500).send();
        return;
    }

    
    let mysql = require('mysql');
    let config = require('../db/db_info');
    let pool = await db.getPool();

    pool.getConnection(function(err, conn) {
        if (!err) {
            conn.query(query, [values], (err, result) => {
                if (conn) conn.release();
                if (err) {
                    res.status(500).send(err);
                } else {
                    res.status(200).send({message : 'Submit success!!'});
                }
            })
        }
        else {
            if (conn) conn.release();
        }
    });
});

module.exports = router;