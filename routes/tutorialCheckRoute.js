const express = require('express');
const router = express.Router();
const fs = require('fs');
const myers = require('myers-diff');



router.use('/', function(req, res, next) {
    // var data = JSON.parse(req.body.data);
    var lhs = req.body.lhs;
    var rhs = req.body.rhs;
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
    

    res.status(200).send({message : 'Check success!!', lhsTemplate : lhsTemplate, rhsTemplate : rhsTemplate, diffCnt : diff.length});


});

module.exports = router;