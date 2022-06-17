class Selection {
  startPos = -1;
  len = 0;

  constructor(text, lineNum, startPos=-1, len=0) {
    this.text = text;
    this.lineNum = lineNum;
    this.startPos = startPos;
  }

  update(text, lineNum, startPos, len) {
    this.text = text;
    this.lineNum = lineNum;
    this.startPos = startPos;
    this.len = len;
  }
}

let highlight = null;
const highlightColor = '#0FF0F0';
function restoreContent() {
  let p = highlight.parentNode;
  highlight.childNodes.forEach(function (c) {
    p.insertBefore(c.cloneNode(true), highlight);
  });
  p.removeChild(highlight);
  p.normalize();
}

function highlightSelection(range) {
  if(highlight != null && highlight.hasChildNodes()) {    
    restoreContent();
  }
  
  const top = range.commonAncestorContainer;
  if(top.nodeName === "TBODY") {
    const lines = []
    for(let i=0; i<top.childNodes.length; i++) {
      const line = top.childNodes[i];
      if(range.intersectsNode(line)){
        lines.push(line);        
      }
    }
    for(let i=0; i<lines.length; i++) {
      const code = lines[i].childNodes[1];
      const span = document.createElement('span');
      span.style.backgroundColor = highlightColor;
      code.childNodes.forEach(function(c) {
        span.appendChild(c.cloneNode(true));
      });
      const newCode = code.cloneNode(false);
      newCode.appendChild(span);
      code.parentNode.replaceChild(newCode, code);
    }
        
  } else {
    highlight = document.createElement('span');
    highlight.style.backgroundColor = highlightColor;
    range.surroundContents(highlight);
  }  
}

let storedSelectionLeft = new Selection();

function storeSelectionLeft() {
  let selectionText = "";
  let startNum = "";
  let endNum = "";
  let selectionNumber = "";
  let startPos = 0;

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

  let range = document.getSelection().getRangeAt(0);
  if(range.toString().length > 0) {
    highlightSelection(range);
  }

  let sText = selectionText.toString();
  storedSelectionLeft.update(sText, selectionNumber, startPos, sText.length);
}

let storedSelectionRight = new Selection();

function storeSelectionRight() {
  let selectionText = "";
  let startNum = "";
  let endNum = "";
  let selectionNumber = "";
  let startPos = 0;

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

let check = 0;
let tmpStartPos = 0;
let tmpLen = 0;

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
  let cellOpType = newRow.insertCell(0);
  let cellOldCode = newRow.insertCell(1);
  let cellOldLine = newRow.insertCell(2);
  let cellNewCode = newRow.insertCell(3);
  let cellNewLine = newRow.insertCell(4);
  let cellLink = newRow.insertCell(5);
  let scriptJSON = new Object();
  
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

  let newATag = createDeleteButton(delType);
  cellLink.appendChild(newATag);

  scriptJSON.user_code = document.getElementById("userCode").value;
  scriptJSON.type = opType;
  scriptJSON.change_id = document.getElementById("current").value;
  oneScriptSubmit(scriptJSON);
}

function createDeleteButton(delType) {
  let newATag = document.createElement('a');
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
    let table = document.getElementById("edit_scripts");
    let newRow = table.insertRow();
    let selectResult = getSelectResult();
    newRow.id = selectResult.len + "/";

    addEditOp('Delete', newRow, selectResult, null, 0);

    storedSelectionLeft.len = 0;
}

function GenInsert() {
    if (getSelectResult().len == 0) {
        alert("Please select texts.");
        return;
    }
    let table = document.getElementById("edit_scripts");
    let newRow = table.insertRow();
    let selectResult = getSelectResult();
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

    let table = document.getElementById("edit_scripts");
    let newRow = table.insertRow();
    let selectResult = getSelectResult();
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

    let table = document.getElementById("edit_scripts");
    let newRow = table.insertRow();
    let selectResult = getSelectResult();
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
    
    let table = document.getElementById("edit_scripts");
    let newRow = table.insertRow();
    let selectResult = getSelectResult();
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

    let table = document.getElementById("edit_scripts");
    let newRow = table.insertRow();
    let selectResult = getSelectResult();
    newRow.id =  storedSelectionLeft.len + "/" + selectResult.len;

    addEditOp('Update', newRow, storedSelectionLeft, selectResult, 1);

    check = 0;

    storedSelectionLeft.len = 0;
    storedSelectionRight.len = 0;
}

async function deleteRow(element, e) {
    let table = document.getElementById("edit_scripts");
    let trs = table.children[0].children;
    let lastRow = trs[trs.length - 1];
    let target = element.parentNode.parentNode;
    let rowNum = target.rowIndex;

    let tds = trs[rowNum].children;

    let lens = target.id.split('/');

    let scriptJSON = new Object();
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
<<<<<<< HEAD
}
=======
}
>>>>>>> e0f68f9f27b29449ae41736396ee60b7fe72edf2
