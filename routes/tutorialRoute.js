const express = require('express');
const router = express.Router();
const uuid = require('uuid');
const fileSelect = require('../public/js/fileSelect');

router.use('/', function(req, res, next) {
    var hashCode = uuid.v4();
    var sql = "select b.change_Id, count(b.change_id) cnt from (select distinct user_code, change_id from scripts_web) b group by b.change_id order by cnt";

    var mysql = require('mysql');
    var config = require('../db/db_info');
    var pool = mysql.createPool(config);

    pool.getConnection(function(err, conn) {
        if (!err) {
            conn.query(sql, function(error, results, fields) {
                if (error) throw error;
        
                req.session.codeFiles = fileSelect.getFiles(results);
                req.session.code = hashCode;
                req.session.fileCnt = 0;
                req.session.save(err => {
                    if (err) {
                        console.log(err);
                        return res.status(500).send("<h1>500 error</h1>");
                    }
                    res.render('../views/tutorial.ejs', {
                    });
                })
            })
        }
        conn.release();
    });
})

module.exports = router;