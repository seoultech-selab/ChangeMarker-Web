let express = require('express');
let router = express.Router();
const db = require('../src/global/db/dbPoolCreator');

router.use('/', async function(req, res, next) {
    let scripts = JSON.parse(req.body.scripts);

    const query = "insert into scripts_web (`user_code`,`type`,`old_code`,`line_number_old`,`new_code`,`line_number_new`,`change_id`) values ?;";
    let values = new Array();
    for (let i = 0; i < scripts.length; i++) {
        let value = new Array();
        value.push(scripts[i].user_code);
        value.push(scripts[i].type);
        value.push(scripts[i].old_code);
        value.push(Number(scripts[i].line_number_old));
        value.push(scripts[i].new_code);
        value.push(Number(scripts[i].line_number_new));
        value.push(scripts[i].change_id);
        values.push(value);
    }
    
    if (values.length == 0) {
        res.write("<script>swal('Empty Edit Script!! Please try again.');history.back();</script>");
    } else {
        let mysql = require('mysql');
        let config = require('../db/db_info');
        let pool = await db.getPool();

        pool.getConnection(function(err, conn) {
            if (!err) {
                conn.query(query, [values], (err, result) => {
                    if (conn) conn.release();
                    if (err) {
                        console.log(err);
                    } else {
                        res.write("<script>swal('Submission success!');window.location.href='fin';</script>");
                    }
                })
            }
            else {
                if (conn) conn.release();
            }
        });
    }
})

module.exports = router;