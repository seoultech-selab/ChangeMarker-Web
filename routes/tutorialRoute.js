const express = require('express');
const router = express.Router();
const uuid = require('uuid');

router.use('/', function(req, res, next) {
    let hashCode = uuid.v4();
    let sql = "select cmw_use_files.change_id, ifnull(d.cnt, 0), cmw_use_files.unique_group from (select b.change_id, count(b.change_id) cnt from (select distinct user_code, change_id from scripts_web) b group by b.change_id order by cnt) d right join cmw_use_files on cmw_use_files.change_id = d.change_id order by d.cnt;"

    let mysql = require('mysql');
    let config = require('../db/db_info');
    let pool = mysql.createPool(config);

    pool.getConnection(function(err, conn) {
        if (!err) {
            conn.query(sql, function(error, results, fields) {
                if (error) throw error;

                let mysql = require('mysql');
                let config = require('../db/db_info');
                let pool = mysql.createPool(config);
                let result = [0, 0, 0, 0, 0];
                
                let resultCnt = 0;
                for (let i = 0; resultCnt < 5; i++) {
                    let group = parseInt(results[i].unique_group.slice(13)) - 2;
                    if (result[group] == 0) {
                        result[group] = results[i].change_id;
                        resultCnt += 1;
                    }
                }
                req.session.codeFiles = result;

                let sql2 = "select `file_name` from change_file_name order by `change_id`;";

                pool.getConnection(function(err, conn) {
                    if (!err) {
                        conn.query(sql2, function(error, results3, fields) {
                            if (error) throw error;

                            let fileNames = new Array();
                            fileNames.push("");
                            for (let i = 0; i < results3.length; i++) {
                                fileNames.push(results3[i].file_name);
                            }
                            
                            req.session.fileNames = fileNames;
                        })
                    }
                    conn.release();
                });

                req.session.code = hashCode;
                req.session.fileCnt = 0;
                setTimeout(() => {
                    req.session.save(err => {
                        if (err) {
                            console.log(err);
                            return res.status(500).send("<h1>500 error</h1>");
                        }
                        res.render('../views/tutorial.ejs', {
                        });
                    })
                }, 2000);
            })
        }
        // conn.release();
    });
})

module.exports = router;