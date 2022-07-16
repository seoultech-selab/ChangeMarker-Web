const express = require('express');
const router = express.Router();
const uuid = require('uuid');
const cmwUseFilesTotalDao = require('../src/domain/cmwUseFilesTotal/cmwUseFilesTotalDao');
const userService = require('../src/domain/user/userService');
const myers = require('myers-diff');

router.get('/', function(req, res, next) {
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
    });
})

router.get("/tu", async function(req, res, next) {
    let page = req.query.page;
    if (page == null || page == undefined)
        page = 1;

    let lhsTemplate = "";
    let rhsTemplate = "";
    let diffNum = 0;
    let currentFileName = 'tutorial00' + page;

    if (page >= 4 && page <= 7) {
        let change_id = 'tutorial00' + (page - 3);
        let value = await cmwUseFilesTotalDao.selectOldCodeAndNewCodeByChangeId(change_id);

        let lhs = value[0].old_code;
        let rhs = value[0].new_code;

        [lhsTemplate, rhsTemplate, diffNum] = await highlightDiffs(lhs, rhs);
    }

    let checkExercise = 1;
    if (req.session != null && req.session.workerId != null) {
        let user = await userService.getByWorkerId(req.session.workerId);
        if (user != null) {
            let status = user.status;
            if (status == 'started' || status == 'finished')
                checkExercise = 8;
            else
                checkExercise = Number(status[status.length - 1]);
        }
    }

    res.render('../views/tutorials.ejs', { 
        page : page,
        lhsTemplate : lhsTemplate,
        rhsTemplate : rhsTemplate,
        diffNum : diffNum,
        storedScripts : "",
        currentFileName, currentFileName,
        code : req.session.code,
        checkExercise : checkExercise
    });
});

function convertToHtmlText(s) {
    s = s.replace(/</g, "&lt;");
    s = s.replace(/>/g, "&gt;");
    return s;
}

async function highlightDiffs(lhs, rhs) {
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

    return [lhsTemplate, rhsTemplate, diffNum];
}

module.exports = router;