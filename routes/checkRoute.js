const express = require('express');
const router = express.Router();
const fs = require('fs');
const myers = require('myers-diff');



router.use('/', function(req, res, next) {
    var data = JSON.parse(req.body.data);

    const currentFile = data.diffNum;
    const userCode = data.userCode;

    var mysql = require('mysql');
    var config = require('../db/db_info');

    var pool = mysql.createPool(config);
    pool.getConnection(function(err, conn) {
        if (!err) {
            var query = "select `old_code`,`line_number_old`,`start_pos_old`,`new_code`,`line_number_new`,`start_pos_new` from scripts_web where `user_code`='";
            query += userCode;
            query += "' and `change_id`='";
            query += currentFile;
            query += "' ;";

            conn.query(query, (err, results, field) => {
                if (err) {
                    console.log(err);
                } else {
                    var leftScripts = new Array();
                    var rightScripts = new Array();
                    for (var i in results) {
                        var result = results[i];
                        if (result.line_number_old != null) {
                            var tmpArr = new Object();
                            tmpArr.code = result.old_code;
                            tmpArr.lineNum = result.line_number_old;
                            tmpArr.startPos = result.start_pos_old;
                            tmpArr.length = result.length_old;
                            leftScripts.push(tmpArr);
                        }
                        if (result.line_number_new != null) {
                            var tmpArr = new Object();
                            tmpArr.code = result.new_code;
                            tmpArr.lineNum = result.line_number_new;
                            tmpArr.startPos = result.start_pos_new;
                            tmpArr.length = result.length_new;
                            rightScripts.push(tmpArr);
                        }
                    }
                    leftScripts.sort((a, b) => {
                        if (a.lineNum === b.lineNum) return b.startPos - a.startPos;
                        else return b.lineNum - a.lineNum;
                    });
                    rightScripts.sort((a, b) => {
                        if (a.lineNum === b.lineNum) return b.startPos - a.startPos;
                        else return b.lineNum - a.lineNum;
                    });

                    const baseDir = __dirname.slice(0, -7);
                    let fileList = fs.readFileSync(baseDir + '/change_files.txt', 'utf-8');
                    fileList = fileList.split('/');
                
                    var fileNum = Number(currentFile.slice(6));
                    var lhs = fs.readFileSync(baseDir + '/changes/' + currentFile + '/old/' + fileList[fileNum],'utf-8');
                    var rhs = fs.readFileSync(baseDir + '/changes/' + currentFile + '/new/' + fileList[fileNum],'utf-8');
                    
                    var lhsArray = lhs.split('\n');
                    var rhsArray = rhs.split('\n');


                    for (var i in leftScripts) {
                        var currentScript = leftScripts[i];

                        var currentCode = currentScript.code;
                        var currentLineNum = currentScript.lineNum - 1;
                        var currentStartPos = currentScript.startPos;

                        var codesArray = currentCode.split('\n');
                        for (var j in codesArray) {
                            if (lhsArray[currentLineNum].substring(currentStartPos, currentStartPos + codesArray[j].length) != codesArray[j]) {
                                var wordsArray = lhsArray[currentLineNum].split(' ');
                                for (var i in wordsArray) {
                                    currentStartPos += wordsArray[i].length;
                                    if (i > 0) {
                                        currentStartPos += 1;
                                    }
                                    if (lhsArray[currentLineNum].substring(currentStartPos, currentStartPos + codesArray[j].length) == codesArray[j]) {
                                        break;
                                    }
                                }
                            }
                            lhsArray[currentLineNum] = lhsArray[currentLineNum].substring(0, currentStartPos) + lhsArray[currentLineNum].substring(currentStartPos + codesArray[j].length);

                            currentLineNum += 1;
                            currentStartPos = 0;
                        }
                        
                    }

                    for (var i in rightScripts) {
                        var currentScript = rightScripts[i];

                        var currentCode = currentScript.code;
                        var currentLineNum = currentScript.lineNum - 1;
                        var currentStartPos = currentScript.startPos;

                        var codesArray = currentCode.split('\n');
                        for (var j in codesArray) {
                            if (rhsArray[currentLineNum].substring(currentStartPos, currentStartPos + codesArray[j].length) != codesArray[j]) {
                                var wordsArray = rhsArray[currentLineNum].split(' ');
                                for (var i in wordsArray) {
                                    currentStartPos += wordsArray[i].length;
                                    if (i > 0) {
                                        currentStartPos += 1;
                                    }
                                    if (rhsArray[currentLineNum].substring(currentStartPos, currentStartPos + codesArray[j].length) == codesArray[j]) {
                                        break;
                                    }
                                }
                            }
                            rhsArray[currentLineNum] = rhsArray[currentLineNum].substring(0, currentStartPos) + rhsArray[currentLineNum].substring(currentStartPos + codesArray[j].length);

                            currentLineNum += 1;
                            currentStartPos = 0;
                        }
                    }
                    var lhsTotal = "";
                    var rhsTotal = "";
                    for (var i in lhsArray) {
                        lhsTotal += lhsArray[i];
                    }
                    for (var i in rhsArray) {
                        rhsTotal += rhsArray[i];
                    }

                    const diff = myers.diff(lhsTotal, rhsTotal);
                    var completed = req.session.completed;
                    var fileCnt = req.session.fileCnt;
                    if (diff.length == 0) {
                        completed[fileCnt] = 1;
                    }
                    else {
                        completed[fileCnt] = -1;
                    }
                    req.session.completed = completed;
                    

                    res.status(200).send({message : 'Check success!!', completed : completed[fileCnt], fileCnt : fileCnt});
                }
            })
        }
        conn.release();
    });
});

module.exports = router;