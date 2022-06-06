const express = require('express');
const router = express.Router();
const fs = require('fs');
const myers = require('myers-diff');



router.use('/', function(req, res, next) {
    let data = JSON.parse(req.body.data);

    const currentFile = data.diffNum;
    const userCode = data.userCode;

    let mysql = require('mysql');
    let config = require('../db/db_info');

    let pool = mysql.createPool(config);
    pool.getConnection(function(err, conn) {
        if (!err) {
            let query = "select `old_code`,`line_number_old`,`start_pos_old`,`length_old`,`new_code`,`line_number_new`,`start_pos_new`,`length_new` from scripts_web where `user_code`='";
            query += userCode;
            query += "' and `change_id`='";
            query += currentFile;
            query += "' ;";

            conn.query(query, (err, results, field) => {
                if (err) {
                    console.log(err);
                } else {
                    let leftScripts = new Array();
                    let rightScripts = new Array();
                    for (let i in results) {
                        let result = results[i];
                        if (result.line_number_old != null) {
                            let tmpArr = new Object();
                            tmpArr.code = result.old_code;
                            tmpArr.lineNum = result.line_number_old;
                            tmpArr.startPos = result.start_pos_old;
                            tmpArr.length = result.length_old;
                            leftScripts.push(tmpArr);
                        }
                        if (result.line_number_new != null) {
                            let tmpArr = new Object();
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
                    let fileList = req.session.fileNames;
                
                    let fileNum = Number(currentFile.slice(6));
                    let lhs = fs.readFileSync(baseDir + '/changes/' + currentFile + '/old/' + fileList[fileNum],'utf-8');
                    let rhs = fs.readFileSync(baseDir + '/changes/' + currentFile + '/new/' + fileList[fileNum],'utf-8');
                    
                    let lhsArray = lhs.split('\n');
                    let rhsArray = rhs.split('\n');

                    for (let i in leftScripts) {
                        let currentScript = leftScripts[i];

                        let currentCode = currentScript.code;
                        let currentLineNum = currentScript.lineNum - 1;
                        let currentStartPos = 0;

                        let codesArray = currentCode.split('\n');
                        for (let j in codesArray) {
                            let check = 1;
                            if (lhsArray[currentLineNum].substring(currentStartPos, currentStartPos + codesArray[j].length) != codesArray[j]) {
                                check = 0;
                                if (lhsArray[currentLineNum].trim().length == 0 || codesArray[j].trim().length != 0) {
                                    while (lhsArray[currentLineNum].trim().length == 0)
                                    currentLineNum += 1;
                                }
                                let wordsArray = lhsArray[currentLineNum].split(' ');
                                for (let i in wordsArray) {
                                    currentStartPos += wordsArray[i].length;
                                    if (i > 0) {
                                        currentStartPos += 1;
                                    }
                                    if (lhsArray[currentLineNum].substring(currentStartPos, currentStartPos + codesArray[j].length) == codesArray[j]) {
                                        check = 1;
                                        break;
                                    }
                                }
                            }
                            if (check == 1)
                                lhsArray[currentLineNum] = lhsArray[currentLineNum].substring(0, currentStartPos) + lhsArray[currentLineNum].substring(currentStartPos + codesArray[j].length);
                            else
                                lhsArray[currentLineNum] = "";

                            currentLineNum += 1;
                            currentStartPos = 0;
                        }
                        
                    }

                    for (let i in rightScripts) {
                        let currentScript = rightScripts[i];

                        let currentCode = currentScript.code;
                        let currentLineNum = currentScript.lineNum - 1;
                        let currentStartPos = 0;

                        let codesArray = currentCode.split('\n');
                        for (let j in codesArray) {
                            let check = 1;
                            if (rhsArray[currentLineNum].substring(currentStartPos, currentStartPos + codesArray[j].length) != codesArray[j]) {
                                check = 0;
                                if (rhsArray[currentLineNum].trim().length == 0 || codesArray[j].trim().length != 0) {
                                    while (rhsArray[currentLineNum].trim().length == 0)
                                    currentLineNum += 1;
                                }
                                let wordsArray = rhsArray[currentLineNum].split(' ');
                                for (let i in wordsArray) {
                                    currentStartPos += wordsArray[i].length;
                                    if (i > 0) {
                                        currentStartPos += 1;
                                    }
                                    if (rhsArray[currentLineNum].substring(currentStartPos, currentStartPos + codesArray[j].length) == codesArray[j]) {
                                        check = 1;
                                        break;
                                    }
                                }
                            }
                            if (check == 1) {
                                rhsArray[currentLineNum] = rhsArray[currentLineNum].substring(0, currentStartPos) + rhsArray[currentLineNum].substring(currentStartPos + codesArray[j].length);
                            }
                            else {
                                rhsArray[currentLineNum] = " ";
                            }

                            currentLineNum += 1;
                            currentStartPos = 0;
                        }
                    }
                    let lhsTotal = "";
                    let rhsTotal = "";
                    for (let i in lhsArray) {
                        lhsTmp = lhsArray[i].trim();
                        if (lhsTmp.length != 0)
                            lhsTotal += lhsTmp;
                    }
                    for (let i in rhsArray) {
                        rhsTmp = rhsArray[i].trim();
                        if (rhsTmp.length != 0)
                            rhsTotal += rhsTmp;
                    }

                    const diff = myers.diff(lhsTotal, rhsTotal);
                    let completed = req.session.completed;
                    let fileCnt = req.session.fileCnt;
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
        // conn.release();
    });
});

module.exports = router;