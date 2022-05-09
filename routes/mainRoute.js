const express = require('express');
const router = express.Router();

function mkFileName(num) {
    if (num < 1) {
        result = "change500";
    } else if (num < 10) {
        result = "change00" + num;
    } else if (num < 100) {
        result = "change0" + num;
    } else if (num <= 500) {
        result = "change" + num;
    } else {
        result = "change001";
    }
    return result;
}

const fs = require('fs');
const myers = require('myers-diff');
const Connection = require('mysql/lib/Connection');

var baseDir = __dirname.slice(0, -7);

let fileList = fs.readFileSync(baseDir + '/change_files.txt', 'utf-8');
fileList = fileList.split('/');

router.use('/', function(req, res, next) {
    if (req.body.fileCnt != undefined) {
        var fileCnt = Number(req.body.fileCnt);
        req.session.fileCnt = fileCnt;
    }
    else {
        req.session.fileCnt = 0;
        var fileCnt = req.session.fileCnt;
    }

    if (req.session.completed == undefined) {
        req.session.completed = [0,0,0,0,0,];
    }
    
    var fileNum = req.session.codeFiles[fileCnt];
    var numExt = parseInt(fileNum.slice(6));
    const lhs = fs.readFileSync(baseDir + '/changes/' + fileNum + '/old/' + fileList[numExt],'utf-8');
    let rhs = fs.readFileSync(baseDir + '/changes/' + fileNum + '/new/' + fileList[numExt],'utf-8');

    const diff = myers.diff(lhs, rhs);
    
    var lhsPos = [];
    var rhsPos = [];
    for (var i = 0; i < diff.length; i++) {
        lhsPos.push(diff[i].lhs.pos);
        rhsPos.push(diff[i].rhs.pos);
    }

    var lhsTemplate = ``;

    var cnt = 0;
    for (var i = 0; i < lhs.length; i++) {
        if (lhsPos.includes(i)) {
            var lineCnt = 0;
            var zeroSpanStart = ``;
            var noneZeroSpans = ``;
            if ("add" in diff[cnt].lhs) {
                zeroSpanStart = `<span class="line_add" id="#l${cnt}">`;
                noneZeroSpans = `<span class="line_add">`;
                lineCnt = diff[cnt].lhs.add;
            }
            else {
                zeroSpanStart = `<span class="line_del" id="#l${cnt}">`;
                noneZeroSpans = `<span class="line_del">`;
                lineCnt = diff[cnt].lhs.del;
            }

            if (lineCnt == 0) {
                lhsTemplate += zeroSpanStart;
                lhsTemplate += `</span>`;
            }

            var jCnt = 0;
            for (var k = 0; k < lineCnt; k++) {
                if (k == 0) {
                    lhsTemplate += zeroSpanStart;
                }
                else {
                    lhsTemplate += noneZeroSpans;
                }
                while (jCnt < diff[cnt].lhs.length) {
                    if (lhs[i] == "\n") {
                        lhsTemplate += lhs[i];
                        i++;
                        jCnt++;
                        break;
                    }
                    lhsTemplate += lhs[i];
                    i++;
                    jCnt++;
                }
                lhsTemplate += `</span>`;

            }
            lhsTemplate += lhs[i];
            cnt++;
        }
        else {
            lhsTemplate += lhs[i];
        }
    }
    var diffNum = cnt;

    var rhsTemplate = ``;

    var cnt = 0;
    for (var i = 0; i < rhs.length; i++) {
        if (rhsPos.includes(i)) {
            var lineCnt = 0;
            var zeroSpanStart = ``;
            var noneZeroSpans = ``;
            if ("add" in diff[cnt].rhs) {
                zeroSpanStart = `<span class="line_add" id="#r${cnt}">`;
                noneZeroSpans = `<span class="line_add">`;
                lineCnt = diff[cnt].rhs.add;
            }
            else {
                zeroSpanStart = `<span class="line_del" id="#r${cnt}">`;
                noneZeroSpans = `<span class="line_del">`;
                lineCnt = diff[cnt].rhs.del;
            }

            if (lineCnt == 0) {
                rhsTemplate += zeroSpanStart;
                rhsTemplate += `</span>`;
            }

            var jCnt = 0;
            for (var k = 0; k < lineCnt; k++) {
                if (k == 0) {
                    rhsTemplate += zeroSpanStart;
                }
                else {
                    rhsTemplate += noneZeroSpans;
                }
                while (jCnt < diff[cnt].rhs.length){
                    if (rhs[i] == "\n") {
                        rhsTemplate += rhs[i];
                        i++;
                        jCnt++;
                        break;
                    }
                    rhsTemplate += rhs[i];
                    i++;
                    jCnt++;
                }
                rhsTemplate += `</span>`;
            }
            rhsTemplate += rhs[i];
            cnt++;
        }
        else {
            rhsTemplate += rhs[i];
        }
    }

    var editScriptArray = new Array();
    for (var i = 0; i < 10; i++) {
        var editScript = new Object();
        editScript.type = "del" + i;
        editScript.oldCode = "a" + i;
        editScript.lineOld = i;
        editScript.newCode = "h" + i;
        editScript.lineNew = i + 1;
        editScriptArray.push(editScript);
    }
    
    var editScripts = new Object;
    editScripts.data = editScriptArray;

    var code = req.session.code;
    
    var mysql = require('mysql');
    var config = require('../db/db_info');
    var pool = mysql.createPool(config);

    var query = "select `type`,`old_code`,`line_number_old`,`length_old`,`new_code`,`line_number_new`,`length_new` from scripts_web where `user_code`='";
    query += code;
    query += "' and `change_id`='";
    query += fileNum;
    query += "';";

    pool.getConnection(function(err, conn) {
        if (!err) {
            conn.query(query, function(err, results, field) {
                var storedScripts = ``;
                for (var idx in results) {
                    var trId = "";
                    trId += (results[idx].length_old == null ? "" : results[idx].length_old);
                    trId += "/";
                    trId += (results[idx].length_new == null ? "" : results[idx].length_new);
                    storedScripts += `<tr id="`;
                    storedScripts += trId;
                    storedScripts += `">`;
        
                    storedScripts += `<td>`;
                    storedScripts += results[idx].type;
                    storedScripts += `</td>`;
                    storedScripts += `<td>`;
                    storedScripts += (results[idx].old_code == null ? "" : results[idx].old_code);
                    storedScripts += `</td>`;
                    storedScripts += `<td>`;
                    storedScripts += (results[idx].line_number_old == null ? "" : results[idx].line_number_old);
                    storedScripts += `</td>`;
                    storedScripts += `<td>`;
                    storedScripts += (results[idx].new_code == null ? "" : results[idx].new_code);
                    storedScripts += `</td>`;
                    storedScripts += `<td>`;
                    storedScripts += (results[idx].line_number_new == null ? "" : results[idx].line_number_new);
                    storedScripts += `</td>`;
                    storedScripts += `<td>`;
                    storedScripts += `<a href="javascript:void(0)" class="del_btn" onclick="deleteRow(this, 0);">Delete</a>`;
                    storedScripts += `</td>`;
        
                    storedScripts += `</tr>`;
                }
            
                res.render('../views/marker.ejs', {
                    currentFileName : fileNum,
                    mkFileName : mkFileName,
                    lhsTemplate : lhsTemplate,
                    rhsTemplate : rhsTemplate,
                    editScripts : editScripts,
                    diffNum : diffNum,
                    code : code,
                    fileCnt : fileCnt,
                    storedScripts : storedScripts,
                    completed : req.session.completed
                });
            });
        }
        conn.release();
    });


    
    
    
    
});

module.exports = router;