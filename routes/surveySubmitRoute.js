const express = require('express');
const router = express.Router();

router.use('/', function(req, res, next) {
    let mysql = require('mysql');
    let config = require('../db/db_info');
    let pool = mysql.createPool(config);
    pool.getConnection(function(err, conn) {
        if (!err) {
            let query = "SELECT `user_code`, `change_id1`, `change_id2`, `change_id3`, `change_id4`, `change_id5` FROM cmw_participants WHERE `email` = '";
            query += req.body.email;
            query += "';";
            conn.query(query, (err, result) => {
                if (result.length == 0) {
                    let query2 = "INSERT INTO cmw_participants(`user_code`, `email`, `job`, `change_id1`, `change_id2`, `change_id3`, `change_id4`, `change_id5`) values('";
                    query2 += req.session.code;
                    query2 += "', '";
                    query2 += req.body.email;
                    query2 += "', '";
                    query2 += req.body.job;
                    query2 += "', '";
                    query2 += req.session.codeFiles[0];
                    query2 += "', '";
                    query2 += req.session.codeFiles[1];
                    query2 += "', '";
                    query2 += req.session.codeFiles[2];
                    query2 += "', '";
                    query2 += req.session.codeFiles[3];
                    query2 += "', '";
                    query2 += req.session.codeFiles[4];
                    query2 += "');";
                    conn.query(query2, (err, result) => {
                        if (err) {
                            alert(err);
                        } else {
                            res.status(200).send({message : 'Insert participant success!!'});
                        }
                    })
                }
                else {
                    req.session.code = result[0].user_code;
                    let codeFiles = new Array();
                    codeFiles.push(result[0].change_id1);
                    codeFiles.push(result[0].change_id2);
                    codeFiles.push(result[0].change_id3);
                    codeFiles.push(result[0].change_id4);
                    codeFiles.push(result[0].change_id5);
                    req.session.codeFiles = codeFiles;
                    res.status(200).send({message : 'success!'});
                }
            })

            
        }
        conn.release();
    });
});

module.exports = router;