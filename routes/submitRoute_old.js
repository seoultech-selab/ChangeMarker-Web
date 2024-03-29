var express = require('express');
var router = express.Router();
const db = require('../src/global/db/dbPoolCreator');

router.use('/', async  function(req, res, next) {
    var scripts = JSON.parse(req.body.scripts);

    const query = "insert into scripts_web (`user_code`,`type`,`old_code`,`line_number_old`,`new_code`,`line_number_new`,`change_id`) values ?;";
    var values = new Array();
    for (var i = 0; i < scripts.length; i++) {
        var value = new Array();
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
        var mysql = require('mysql');
        var config = require('../db/db_info');
        var pool = await db.getPool();

        pool.getConnection(function(err, conn) {
            if (!err) {
                conn.query(query, [values], (err, result) => {
                    if (conn) conn.release();
                    if (err) {
                        console.log(err);
                    } else {
                        req.session.fileCnt += 1;
                        res.send("<html><head><script>"
                                    + "function goNext() {swal('Submission success!');"
                                    + "var form = document.createElement('form');"
                                    + "document.body.appendChild(form);"
                                    + "form.method = 'post';"
                                    + "form.action = window.location.href;"
                                    + "form.submit();}"
                                    + "</script></head>"
                                    + "<body onload='goNext()'></body>"
                                    + "</html>");
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