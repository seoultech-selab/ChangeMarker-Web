var check = 0;
var tmpStartPos = 0;
var tmpLen = 0;
function GenController(e) {
    if (e == 1 && check == 0) {
        GenDelete();
    } else if (e == 2 && check == 0) {
        GenInsert();
    } else if (e == 3 && (check == 0 || check == 1)) {
        GenMoveLeft();
    } else if (e == 4 && (check == 0 || check == 2)) {
        GenMoveRight();
    } else if (e == 5 && (check == 0 || check == 3)) {
        GenUpdateLeft();
    } else if (e == 6 && (check == 0 || check == 4)) {
        GenUpdateRight();
    } else if (check == 1) {
        alert("Please generate Move on left side code.");
    } else if (check == 2) {
        alert("Please generate Move on right side code.");
    } else if (check == 3) {
        alert("Please generate Update on left side code.");
    } else if (check == 4) {
        alert("Please generate Update on right side code.");
    }
}

function GenDelete() {
    if (getSelectResult().len == 0) {
        alert("Please select texts.");
        return;
    }
    var table = document.getElementById("edit_scripts");
    var newRow = table.insertRow();
    var selectResult = getSelectResult();
    newRow.id = selectResult.len + "/";
    var newATag = document.createElement('a');
    newATag.href = "javascript:void(0)";
    newATag.text = "Delete";
    newATag.className = "del_btn";
    newATag.onclick = function() {deleteRow(this, 0);};


    var newCell1 = newRow.insertCell(0);
    var newCell2 = newRow.insertCell(1);
    var newCell3 = newRow.insertCell(2);
    var newCell4 = newRow.insertCell(3);
    var newCell5 = newRow.insertCell(4);
    var newCell6 = newRow.insertCell(5);

    newCell1.innerText = 'Delete';
    newCell2.innerText = selectResult.text;
    newCell3.innerText = selectResult.lineNum;
    newCell6.appendChild(newATag);


    var scriptJSON = new Object();
    scriptJSON.user_code = document.getElementById("userCode").value;
    scriptJSON.type = "Delete";
    scriptJSON.old_code = selectResult.text;
    scriptJSON.line_number_old = selectResult.lineNum;
    scriptJSON.start_pos_old = selectResult.startPos;
    scriptJSON.length_old = selectResult.len;
    scriptJSON.change_id = document.getElementById("current").value;

    oneScriptSubmit(scriptJSON);
}

function GenInsert() {
    if (getSelectResult().len == 0) {
        alert("Please select texts.");
        return;
    }
    var table = document.getElementById("edit_scripts");
    var newRow = table.insertRow();
    var selectResult = getSelectResult();
    newRow.id = "/" + selectResult.len;

    var newATag = document.createElement('a');
    newATag.href = "javascript:void(0)";
    newATag.text = "Delete";
    newATag.className = "del_btn";
    newATag.onclick = function() {deleteRow(this, 0);};


    var newCell1 = newRow.insertCell(0);
    var newCell2 = newRow.insertCell(1);
    var newCell3 = newRow.insertCell(2);
    var newCell4 = newRow.insertCell(3);
    var newCell5 = newRow.insertCell(4);
    var newCell6 = newRow.insertCell(5);

    newCell1.innerText = 'Insert';
    newCell4.innerText = selectResult.text;
    newCell5.innerText = selectResult.lineNum;
    newCell6.appendChild(newATag);


    var scriptJSON = new Object();
    scriptJSON.user_code = document.getElementById("userCode").value;
    scriptJSON.type = "Insert";
    scriptJSON.new_code = selectResult.text;
    scriptJSON.line_number_new = selectResult.lineNum;
    scriptJSON.start_pos_new = selectResult.startPos;
    scriptJSON.length_new = selectResult.len;
    scriptJSON.change_id = document.getElementById("current").value;

    oneScriptSubmit(scriptJSON);
}

function GenMoveLeft() {
    if (getSelectResult().len == 0) {
        alert("Please select texts.");
        return;
    }
    if (check == 0) {
        var table = document.getElementById("edit_scripts");
        var newRow = table.insertRow();
        var selectResult = getSelectResult();
        newRow.id = selectResult.len + "/";

        var newATag = document.createElement('a');
        newATag.href = "javascript:void(0)";
        newATag.text = "Delete";
        newATag.className = "del_btn";
        newATag.onclick = function() {deleteRow(this, 1);};


        var newCell1 = newRow.insertCell(0);
        var newCell2 = newRow.insertCell(1);
        var newCell3 = newRow.insertCell(2);
        var newCell4 = newRow.insertCell(3);
        var newCell5 = newRow.insertCell(4);
        var newCell6 = newRow.insertCell(5);

        newCell1.innerText = 'Move';
        newCell2.innerText = selectResult.text;
        newCell3.innerText = selectResult.lineNum;
        newCell6.appendChild(newATag);
        tmpStartPos = selectResult.startPos;
        tmpLen = selectResult.len;
        check = 2;
    } else if (check == 1) {
        var selectResult = getSelectResult();
        var table = document.getElementById("edit_scripts");
        var trs = table.children[0].children;
        var tr = trs[trs.length - 1];
        var tds = tr.children;

        tr.id = selectResult.len + tr.id;

        tds[1].innerText = selectResult.text;
        tds[2].innerText = selectResult.lineNum;
        check = 0;


        var scriptJSON = new Object();
        scriptJSON.user_code = document.getElementById("userCode").value;
        scriptJSON.type = "Move";
        scriptJSON.old_code = selectResult.text;
        scriptJSON.line_number_old = selectResult.lineNum;
        scriptJSON.start_pos_old = selectResult.startPos;
        scriptJSON.length_old = selectResult.len;
        scriptJSON.new_code = tds[3].innerText;
        scriptJSON.line_number_new = tds[4].innerText;
        scriptJSON.start_pos_new = tmpStartPos;
        scriptJSON.length_new = tmpLen;
        scriptJSON.change_id = document.getElementById("current").value;

        oneScriptSubmit(scriptJSON);
    }
}

function GenMoveRight() {
    if (getSelectResult().len == 0) {
        alert("Please select texts.");
        return;
    }
    if (check == 0) {
        var table = document.getElementById("edit_scripts");
        var newRow = table.insertRow();
        var selectResult = getSelectResult();
        newRow.id = "/" + selectResult.len;

        var newATag = document.createElement('a');
        newATag.href = "javascript:void(0)";
        newATag.text = "Delete";
        newATag.className = "del_btn";
        newATag.onclick = function() {deleteRow(this, 1);};


        var newCell1 = newRow.insertCell(0);
        var newCell2 = newRow.insertCell(1);
        var newCell3 = newRow.insertCell(2);
        var newCell4 = newRow.insertCell(3);
        var newCell5 = newRow.insertCell(4);
        var newCell6 = newRow.insertCell(5);

        newCell1.innerText = 'Move';
        newCell4.innerText = selectResult.text;
        newCell5.innerText = selectResult.lineNum;
        newCell6.appendChild(newATag);
        tmpStartPos = selectResult.startPos;
        tmpLen = selectResult.len;
        check = 1;
    } else if (check == 2) {
        var selectResult = getSelectResult();
        var table = document.getElementById("edit_scripts");
        var trs = table.children[0].children;
        var tr = trs[trs.length - 1];
        var tds = tr.children;
        tr.id = tr.id + selectResult.len;

        tds[3].innerText = selectResult.text;
        tds[4].innerText = selectResult.lineNum;
        check = 0;


        var scriptJSON = new Object();
        scriptJSON.user_code = document.getElementById("userCode").value;
        scriptJSON.type = "Move";
        scriptJSON.old_code = tds[1].innerText;
        scriptJSON.line_number_old = tds[2].innerText;
        scriptJSON.start_pos_old = tmpStartPos;
        scriptJSON.length_old = tmpLen;
        scriptJSON.new_code = selectResult.text;
        scriptJSON.line_number_new = selectResult.lineNum;
        scriptJSON.start_pos_new = selectResult.startPos;
        scriptJSON.length_new = selectResult.len;
        scriptJSON.change_id = document.getElementById("current").value;

        oneScriptSubmit(scriptJSON);
    }
}

function GenUpdateLeft() {
    if (getSelectResult().len == 0) {
        alert("Please select texts.");
        return;
    }
    if (check == 0) {
        var table = document.getElementById("edit_scripts");
        var newRow = table.insertRow();
        var selectResult = getSelectResult();
        newRow.id = selectResult.len +  "/";

        var newATag = document.createElement('a');
        newATag.href = "javascript:void(0)";
        newATag.text = "Delete";
        newATag.className = "del_btn";
        newATag.onclick = function() {deleteRow(this, 1);};


        var newCell1 = newRow.insertCell(0);
        var newCell2 = newRow.insertCell(1);
        var newCell3 = newRow.insertCell(2);
        var newCell4 = newRow.insertCell(3);
        var newCell5 = newRow.insertCell(4);
        var newCell6 = newRow.insertCell(5);

        newCell1.innerText = 'Update';
        newCell2.innerText = selectResult.text;
        newCell3.innerText = selectResult.lineNum;
        newCell6.appendChild(newATag);
        tmpStartPos = selectResult.startPos;
        tmpLen = selectResult.len;
        check = 4;
    } else if (check == 3) {
        var selectResult = getSelectResult();
        var table = document.getElementById("edit_scripts");
        var trs = table.children[0].children;
        var tr = trs[trs.length - 1];
        var tds = tr.children;
        tr.id = selectResult.len + tr.id;

        tds[1].innerText = selectResult.text;
        tds[2].innerText = selectResult.lineNum;
        check = 0;


        var scriptJSON = new Object();
        scriptJSON.user_code = document.getElementById("userCode").value;
        scriptJSON.type = "Update";
        scriptJSON.old_code = selectResult.text;
        scriptJSON.line_number_old = selectResult.lineNum;
        scriptJSON.start_pos_old = selectResult.startPos;
        scriptJSON.length_old = selectResult.len;
        scriptJSON.new_code = tds[3].innerText;
        scriptJSON.line_number_new = tds[4].innerText;
        scriptJSON.start_pos_new = tmpStartPos;
        scriptJSON.length_new = tmpLen;
        scriptJSON.change_id = document.getElementById("current").value;

        oneScriptSubmit(scriptJSON);
    }
}

function GenUpdateRight() {
    if (getSelectResult().len == 0) {
        alert("Please select texts.");
        return;
    }
    if (check == 0) {
        var table = document.getElementById("edit_scripts");
        var newRow = table.insertRow();
        var selectResult = getSelectResult();
        newRow.id =  "/" + selectResult.len;

        var newATag = document.createElement('a');
        newATag.href = "javascript:void(0)";
        newATag.text = "Delete";
        newATag.className = "del_btn";
        newATag.onclick = function() {deleteRow(this, 1);};


        var newCell1 = newRow.insertCell(0);
        var newCell2 = newRow.insertCell(1);
        var newCell3 = newRow.insertCell(2);
        var newCell4 = newRow.insertCell(3);
        var newCell5 = newRow.insertCell(4);
        var newCell6 = newRow.insertCell(5);

        newCell1.innerText = 'Update';
        newCell4.innerText = selectResult.text;
        newCell5.innerText = selectResult.lineNum;
        newCell6.appendChild(newATag);
        tmpStartPos = selectResult.startPos;
        tmpLen = selectResult.len;
        check = 3;
    } else if (check == 4) {
        var selectResult = getSelectResult();
        var table = document.getElementById("edit_scripts");
        var trs = table.children[0].children;
        var tr = trs[trs.length - 1];
        var tds = tr.children;
        tr.id = tr.id + selectResult.len;

        tds[3].innerText = selectResult.text;
        tds[4].innerText = selectResult.lineNum;
        check = 0;


        var scriptJSON = new Object();
        scriptJSON.user_code = document.getElementById("userCode").value;
        scriptJSON.type = "Update";
        scriptJSON.old_code = tds[1].innerText;
        scriptJSON.line_number_old = tds[2].innerText;
        scriptJSON.start_pos_old = tmpStartPos;
        scriptJSON.length_old = tmpLen;
        scriptJSON.new_code = selectResult.text;
        scriptJSON.line_number_new = selectResult.lineNum;
        scriptJSON.start_pos_new = selectResult.startPos;
        scriptJSON.length_new = selectResult.len;
        scriptJSON.change_id = document.getElementById("current").value;

        oneScriptSubmit(scriptJSON);
    }
}

async function deleteRow(element, e) {
    var table = document.getElementById("edit_scripts");
    var trs = table.children[0].children;
    var lastRow = trs[trs.length - 1];
    var target = element.parentNode.parentNode;
    var rowNum = target.rowIndex;

    var tds = trs[rowNum].children;

    var lens = target.id.split('/');

    var scriptJSON = new Object();
    scriptJSON.user_code = document.getElementById("userCode").value;
    scriptJSON.type = tds[0].innerText;
    scriptJSON.length_old = Number(lens[0]);
    scriptJSON.line_number_old = tds[2].innerText;
    scriptJSON.length_new = Number(lens[1]);
    scriptJSON.line_number_new = tds[4].innerText;
    scriptJSON.change_id = document.getElementById("current").value;

    oneScriptDelete(scriptJSON);

    if (e == 1 && lastRow == target) {
        check = 0;
    }
    table.deleteRow(rowNum);
}