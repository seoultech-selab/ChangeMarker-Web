const express = require('express');
const router = express.Router();
const cmwUseFilesTotalDao = require('../src/domain/cmwUseFilesTotal/cmwUseFilesTotalDao');
const userService = require('../src/domain/user/userService');
const db = require('../src/global/db/dbPoolCreator');

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

const DBText = [
    "<",
    ">"
]

const htmlText = [
    "&lt;",
    "&gt;"
];

function convertToHtmlText(s) {
    s = s.replace(/</g, "&lt;");
    s = s.replace(/>/g, "&gt;");
    return s;
}

const myers = require('myers-diff');


router.post('/', async function(req, res, next) {
    let fileCnt;
    let pool = await db.getPool();

    if (req.body.fileCnt != undefined) {
        fileCnt = Number(req.body.fileCnt);
        req.session.fileCnt = fileCnt;
    }
    else {
        req.session.fileCnt = 0;
        fileCnt = req.session.fileCnt;
    }

    if (req.session.completed == undefined) {
        req.session.completed = [0,0,0,0,0,];
    }

    let user = await userService.getByWorkerId(req.session.workerId);

    let changeId;
    switch (fileCnt) {
        case 0: changeId = user.changeId1; break;
        case 1: changeId = user.changeId2; break;
        case 2: changeId = user.changeId3; break;
        case 3: changeId = user.changeId4; break;
        case 4: changeId = user.changeId5; break;
        default: changeId = user.changeId1; break;
    }


    cmwUseFilesTotalDao.selectOldCodeAndNewCodeByChangeId(changeId).then(e => {
    let oldCodeAndNewCode = e;

    let lhs = oldCodeAndNewCode[0].old_code;
    let rhs = oldCodeAndNewCode[0].new_code;

    lhs = convertToHtmlText(lhs);
    rhs = convertToHtmlText(rhs);

    const diff = myers.diff(lhs, rhs);
    
    let lhsPos = [];
    let rhsPos = [];
    for (let i = 0; i < diff.length; i++) {
        lhsPos.push(diff[i].lhs.pos);
        rhsPos.push(diff[i].rhs.pos);
    }

    let lhsTemplate = ``;

    let cnt = 0;
    for (let i = 0; i < lhs.length; i++) {
        if (lhsPos.includes(i)) {
            let lineCnt = 0;
            let zeroSpanStart = ``;
            let noneZeroSpans = ``;
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

            let jCnt = 0;
            for (let k = 0; k < lineCnt; k++) {
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
    let diffNum = cnt;

    let rhsTemplate = ``;

    cnt = 0;
    for (let i = 0; i < rhs.length; i++) {
        if (rhsPos.includes(i)) {
            let lineCnt = 0;
            let zeroSpanStart = ``;
            let noneZeroSpans = ``;
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

            let jCnt = 0;
            for (let k = 0; k < lineCnt; k++) {
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

    let editScriptArray = new Array();
    for (let i = 0; i < 10; i++) {
        let editScript = new Object();
        editScript.type = "del" + i;
        editScript.oldCode = "a" + i;
        editScript.lineOld = i;
        editScript.newCode = "h" + i;
        editScript.lineNew = i + 1;
        editScriptArray.push(editScript);
    }
    
    let editScripts = new Object;
    editScripts.data = editScriptArray;

    let query = "select `type`,`old_code`,`line_number_old`,`length_old`,`new_code`,`line_number_new`,`length_new` from scripts_web where `user_code`='";
    query += user.userCode;
    query += "' and `change_id`='";
    query += changeId;
    query += "';";

    pool.getConnection(function(err, conn) {
        if (!err) {
            conn.query(query, function(err, results, field) {
                if (conn) conn.release();
                let storedScripts = ``;
                for (let idx in results) {
                    let trId = "";
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
                    currentFileName : changeId,
                    lhsTemplate : lhsTemplate,
                    rhsTemplate : rhsTemplate,
                    editScripts : editScripts,
                    diffNum : diffNum,
                    code : user.userCode,
                    fileCnt : fileCnt,
                    storedScripts : storedScripts,
                    completed : req.session.completed
                });
            });
        }
        else {
            if (conn) conn.release();
        }
    });
    });
});

module.exports = router;