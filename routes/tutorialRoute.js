const express = require('express');
const router = express.Router();
const uuid = require('uuid');

router.use('/', function(req, res, next) {
    let hashCode = uuid.v4();
    let sql = "select b.change_id, count(b.change_id) cnt from (select distinct user_code, change_id from scripts_web) b group by b.change_id order by cnt";

    let mysql = require('mysql');
    let config = require('../db/db_info');
    let pool = mysql.createPool(config);

    pool.getConnection(function(err, conn) {
        if (!err) {
            conn.query(sql, function(error, results, fields) {
                if (error) throw error;

                let sql = "select `change_id` from cmw_use_files;";

                let mysql = require('mysql');
                let config = require('../db/db_info');
                let pool = mysql.createPool(config);
                let result = new Array();
            
                pool.getConnection(function(err, conn) {
                    if (!err) {
                        conn.query(sql, function(error, results2, fields) {
                            if (error) throw error;
                            
                            let diffNum = results2.length - results.length;
                            if (diffNum > 0) {
                                let filesObjArray = new Array();
                                for (let i = 0; i < results.length; i++) {
                                    filesObjArray.push(results[i].change_id);
                                }
                                for (let i = 0; i < results2.length; i++){
                                    if (!(filesObjArray.includes(results2[i].change_id))) {
                                        result.push(results2[i].change_id);
                                    }
                                    if (result.length == 5)
                                        break;
                                }
                                let cnt = 0;
                                while (result.length < 5) {
                                    result.push(results[cnt].change_id);
                                    cnt++;
                                }
                            } else {
                                for (let i = 0; i < 5; i++) {
                                    result.push(results[i].change_id);
                                }
                            }
                            req.session.codeFiles = result;
                        })
                    }
                    conn.release();
                });

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