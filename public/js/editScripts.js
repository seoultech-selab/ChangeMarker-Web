var storedSelectionLeft = new Object();
storedSelectionLeft.len = 0;

function storeSelectionLeft() {
  var result = new Object();
  var selectionText = "";
  var startNum = "";
  var endNum = "";
  var selectionNumber = "";
  var startPos = 0;

  if (document.getSelection) {
    selectionText = document.getSelection();
    startPos = selectionText.getRangeAt(0).startOffset;
  } else if (document.selection) {
    selectionText = document.selection.createRange().text;
  }

  if (document.getSelection().anchorNode.parentElement.attributes.length == 2 && !(document.getSelection().anchorNode.parentElement.attributes[1].value.includes('#'))) {
    startNum = document.getSelection().anchorNode.parentElement.attributes[1].value;
  } else if (document.getSelection().anchorNode.parentElement.firstChild.parentNode.offsetParent.attributes.length == 2 && !(document.getSelection().anchorNode.parentElement.firstChild.parentNode.offsetParent.attributes[1].value.includes('#'))) {
    startNum = document.getSelection().anchorNode.parentElement.firstChild.parentNode.offsetParent.attributes[1].value;
  }

  if (document.getSelection().focusNode.parentElement.attributes.length == 2 && !(document.getSelection().focusNode.parentElement.attributes[1].value.includes('#'))) {
    endNum = document.getSelection().focusNode.parentElement.attributes[1].value;
  } else if (document.getSelection().focusNode.parentElement.firstChild.parentNode.offsetParent.attributes.length == 2 && !(document.getSelection().focusNode.parentElement.firstChild.parentNode.offsetParent.attributes[1].value.includes('#'))) {
    endNum = document.getSelection().focusNode.parentElement.firstChild.parentNode.offsetParent.attributes[1].value;
  }

  startNum *= 1;
  endNum *= 1;

  if (startNum == 0) {
    selectionNumber = endNum;
  } else if (endNum == 0) {
    selectionNumber = startNum;
  } else {
    selectionNumber = (startNum < endNum) ? startNum : endNum;
  }

  result.text = selectionText.toString();
  result.lineNum = selectionNumber;
  result.startPos = startPos;
  result.len = result.text.length;

  storedSelectionLeft = result;
}

var storedSelectionRight = new Object();
storedSelectionRight.len = 0;

function storeSelectionRight() {
  var result = new Object();
  var selectionText = "";
  var startNum = "";
  var endNum = "";
  var selectionNumber = "";
  var startPos = 0;

  if (document.getSelection) {
    selectionText = document.getSelection();
    startPos = selectionText.getRangeAt(0).startOffset;
  } else if (document.selection) {
    selectionText = document.selection.createRange().text;
  }

  if (document.getSelection().anchorNode.parentElement.attributes.length == 2 && !(document.getSelection().anchorNode.parentElement.attributes[1].value.includes('#'))) {
    startNum = document.getSelection().anchorNode.parentElement.attributes[1].value;
  } else if (document.getSelection().anchorNode.parentElement.firstChild.parentNode.offsetParent.attributes.length == 2 && !(document.getSelection().anchorNode.parentElement.firstChild.parentNode.offsetParent.attributes[1].value.includes('#'))) {
    startNum = document.getSelection().anchorNode.parentElement.firstChild.parentNode.offsetParent.attributes[1].value;
  }

  if (document.getSelection().focusNode.parentElement.attributes.length == 2 && !(document.getSelection().focusNode.parentElement.attributes[1].value.includes('#'))) {
    endNum = document.getSelection().focusNode.parentElement.attributes[1].value;
  } else if (document.getSelection().focusNode.parentElement.firstChild.parentNode.offsetParent.attributes.length == 2 && !(document.getSelection().focusNode.parentElement.firstChild.parentNode.offsetParent.attributes[1].value.includes('#'))) {
    endNum = document.getSelection().focusNode.parentElement.firstChild.parentNode.offsetParent.attributes[1].value;
  }

  startNum *= 1;
  endNum *= 1;

  if (startNum == 0) {
    selectionNumber = endNum;
  } else if (endNum == 0) {
    selectionNumber = startNum;
  } else {
    selectionNumber = (startNum < endNum) ? startNum : endNum;
  }

  result.text = selectionText.toString();
  result.lineNum = selectionNumber;
  result.startPos = startPos;
  result.len = result.text.length;

  storedSelectionRight = result;
}






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

    storedSelectionLeft.len = 0;
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

    storedSelectionRight.len = 0;
}

function GenMoveLeft() {
    if (getSelectResult().len == 0) {
        alert("Please select texts on the left side.");
        return;
    } else if (storedSelectionRight.len == 0) {
        alert("Please select texts on the right side.");
        return;
    }

    var table = document.getElementById("edit_scripts");
    var newRow = table.insertRow();
    var selectResult = getSelectResult();
    newRow.id = selectResult.len + "/" + storedSelectionRight.len;

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
    newCell4.innerText = storedSelectionRight.text;
    newCell5.innerText = storedSelectionRight.lineNum;
    newCell6.appendChild(newATag);

    check = 0;

    var scriptJSON = new Object();
    scriptJSON.user_code = document.getElementById("userCode").value;
    scriptJSON.type = "Move";
    scriptJSON.old_code = selectResult.text;
    scriptJSON.line_number_old = selectResult.lineNum;
    scriptJSON.start_pos_old = selectResult.startPos;
    scriptJSON.length_old = selectResult.len;
    scriptJSON.new_code = storedSelectionRight.text;
    scriptJSON.line_number_new = storedSelectionRight.lineNum;
    scriptJSON.start_pos_new = storedSelectionRight.startPos;
    scriptJSON.length_new = storedSelectionRight.len;
    scriptJSON.change_id = document.getElementById("current").value;

    oneScriptSubmit(scriptJSON);

    storedSelectionLeft.len = 0;
    storedSelectionRight.len = 0;
}

function GenMoveRight() {
    if (getSelectResult().len == 0) {
        alert("Please select texts on the right side.");
        return;
    } else if (storedSelectionLeft.len == 0) {
        alert("Please select texts on the left side.");
        return;
    }

    var table = document.getElementById("edit_scripts");
    var newRow = table.insertRow();
    var selectResult = getSelectResult();
    newRow.id = storedSelectionLeft.len + "/" + selectResult.len;

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
    newCell2.innerText = storedSelectionLeft.text;
    newCell3.innerText = storedSelectionLeft.lineNum;
    newCell4.innerText = selectResult.text;
    newCell5.innerText = selectResult.lineNum;
    newCell6.appendChild(newATag);

    check = 0;

    var scriptJSON = new Object();
    scriptJSON.user_code = document.getElementById("userCode").value;
    scriptJSON.type = "Move";
    scriptJSON.old_code = storedSelectionLeft.text;
    scriptJSON.line_number_old = storedSelectionLeft.lineNum;
    scriptJSON.start_pos_old = storedSelectionLeft.startPos;
    scriptJSON.length_old = storedSelectionLeft.len;
    scriptJSON.new_code = selectResult.text;
    scriptJSON.line_number_new = selectResult.lineNum;
    scriptJSON.start_pos_new = selectResult.startPos;
    scriptJSON.length_new = selectResult.len;
    scriptJSON.change_id = document.getElementById("current").value;

    oneScriptSubmit(scriptJSON);

    storedSelectionLeft.len = 0;
    storedSelectionRight.len = 0;
}

function GenUpdateLeft() {
    if (getSelectResult().len == 0) {
        alert("Please select texts on the left side.");
        return;
    } else if (storedSelectionRight.len == 0) {
        alert("Please select texts on the right side.");
        return;
    }
    
    var table = document.getElementById("edit_scripts");
    var newRow = table.insertRow();
    var selectResult = getSelectResult();
    newRow.id = selectResult.len +  "/" + storedSelectionRight.len;

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
    newCell4.innerText = storedSelectionRight.text;
    newCell5.innerText = storedSelectionRight.lineNum;
    newCell6.appendChild(newATag);

    check = 0;

    var scriptJSON = new Object();
    scriptJSON.user_code = document.getElementById("userCode").value;
    scriptJSON.type = "Update";
    scriptJSON.old_code = selectResult.text;
    scriptJSON.line_number_old = selectResult.lineNum;
    scriptJSON.start_pos_old = selectResult.startPos;
    scriptJSON.length_old = selectResult.len;
    scriptJSON.new_code = storedSelectionRight.text;
    scriptJSON.line_number_new = storedSelectionRight.lineNum;
    scriptJSON.start_pos_new = storedSelectionRight.startPos;
    scriptJSON.length_new = storedSelectionRight.len;
    scriptJSON.change_id = document.getElementById("current").value;

    oneScriptSubmit(scriptJSON);

    storedSelectionLeft.len = 0;
    storedSelectionRight.len = 0;
}

function GenUpdateRight() {
    if (getSelectResult().len == 0) {
        alert("Please select texts on the right side.");
        return;
    } else if (storedSelectionLeft.len == 0) {
        alert("Please select texts on the left side.");
        return;
    }

    var table = document.getElementById("edit_scripts");
    var newRow = table.insertRow();
    var selectResult = getSelectResult();
    newRow.id =  storedSelectionLeft.len + "/" + selectResult.len;

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
    newCell2.innerText = storedSelectionLeft.text;
    newCell3.innerText = storedSelectionLeft.lineNum;
    newCell4.innerText = selectResult.text;
    newCell5.innerText = selectResult.lineNum;
    newCell6.appendChild(newATag);

    check = 0;

    var scriptJSON = new Object();
    scriptJSON.user_code = document.getElementById("userCode").value;
    scriptJSON.type = "Update";
    scriptJSON.old_code = storedSelectionLeft.text;
    scriptJSON.line_number_old = storedSelectionLeft.lineNum;
    scriptJSON.start_pos_old = storedSelectionLeft.startPos;
    scriptJSON.length_old = storedSelectionLeft.len;
    scriptJSON.new_code = selectResult.text;
    scriptJSON.line_number_new = selectResult.lineNum;
    scriptJSON.start_pos_new = selectResult.startPos;
    scriptJSON.length_new = selectResult.len;
    scriptJSON.change_id = document.getElementById("current").value;

    oneScriptSubmit(scriptJSON);

    storedSelectionLeft.len = 0;
    storedSelectionRight.len = 0;
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