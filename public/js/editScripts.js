class Selection {
  text = '';
  lineNum = -1;
  startPos = -1;
  len = 0;

  constructor(text, lineNum, startPos = -1, len = 0) {
    this.text = text;
    this.lineNum = lineNum;
    this.startPos = startPos;
    this.len = len;
  }

  update(text, lineNum, startPos, len) {
    this.text = text;
    this.lineNum = lineNum;
    this.startPos = startPos;
    this.len = len;
  }
}

var storedSelectionLeft = new Selection();

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
  selectionNumber = getSelectionNum(startNum, selectionNumber, endNum);

  let sText = selectionText.toString();
  storedSelectionLeft.update(sText, selectionNumber, startPos, sText.length);
}

var storedSelectionRight = new Selection();

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
  selectionNumber = getSelectionNum(startNum, selectionNumber, endNum);

  let sText = selectionText.toString();
  storedSelectionRight.update(sText, selectionNumber, startPos, sText.length);
}

function getSelectionNum(startNum, selectionNumber, endNum) {
  if (startNum == 0) {
    selectionNumber = endNum;
  } else if (endNum == 0) {
    selectionNumber = startNum;
  } else {
    selectionNumber = (startNum < endNum) ? startNum : endNum;
  }
  return selectionNumber;
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

function addEditOp(opType, newRow, leftSel, rightSel, delType) {
  var cellOpType = newRow.insertCell(0);
  var cellOldCode = newRow.insertCell(1);
  var cellOldLine = newRow.insertCell(2);
  var cellNewCode = newRow.insertCell(3);
  var cellNewLine = newRow.insertCell(4);
  var cellLink = newRow.insertCell(5);
  var scriptJSON = new Object();
  
  cellOpType.innerText = opType;
  if(leftSel) {
    cellOldCode.innerText = leftSel.text;
    cellOldLine.innerText = leftSel.lineNum;  
    scriptJSON.old_code = leftSel.text;
    scriptJSON.line_number_old = leftSel.lineNum;
    scriptJSON.start_pos_old = leftSel.startPos;
    scriptJSON.length_old = leftSel.len;  
  }
  if(rightSel) {
    cellNewCode.innerText = rightSel.text;
    cellNewLine.innerText = rightSel.lineNum;
    scriptJSON.new_code = rightSel.text;
    scriptJSON.line_number_new = rightSel.lineNum;
    scriptJSON.start_pos_new = rightSel.startPos;
    scriptJSON.length_new = rightSel.len;
  }

  var newATag = createDeleteButton(delType);
  cellLink.appendChild(newATag);

  scriptJSON.user_code = document.getElementById("userCode").value;
  scriptJSON.type = opType;
  scriptJSON.change_id = document.getElementById("current").value;
  oneScriptSubmit(scriptJSON);
}

function createDeleteButton(delType) {
  var newATag = document.createElement('a');
  newATag.href = "javascript:void(0)";
  newATag.text = "Delete";
  newATag.className = "del_btn";
  newATag.onclick = function () { deleteRow(this, delType); };
  return newATag;
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

    addEditOp('Delete', newRow, selectResult, null, 0);

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

    addEditOp('Insert', newRow, null, selectResult, 0);

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

    addEditOp('Move', newRow, selectResult, storedSelectionRight, 1);

    check = 0;

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

    addEditOp('Move', newRow, storedSelectionLeft, selectResult, 1);

    check = 0;

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

    addEditOp('Update', newRow, selectResult, storedSelectionRight, 1);

    check = 0;

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

    addEditOp('Update', newRow, storedSelectionLeft, selectResult, 1);

    check = 0;

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