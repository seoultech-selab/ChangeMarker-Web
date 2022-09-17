class Selection {

  // startPos;
  // len;

  constructor(text, lineNum, startPos=-1, len=0) {
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

let highlightedLeft = [];
let highlightedRight = [];
const highlightColor = '#A0D0FF';

// this function is deprecated (-> restoreContentLeftNew())
function restoreContentLeft() {
  highlightedLeft.forEach(function(n){        
    const p = n.parentNode;
    n.childNodes.forEach(function (c) {
      p.insertBefore(c.cloneNode(true), n);
    });
    p.removeChild(n);
    p.normalize();    
  });
  highlightedLeft = [];
}

function restoreContentLeftNew() {

}

// this function is deprecated (-> restoreContentRightNew())
function restoreContentRight() {
  highlightedRight.forEach(function(n){        
    const p = n.parentNode;
    n.childNodes.forEach(function (c) {
      p.insertBefore(c.cloneNode(true), n);
    });
    p.removeChild(n);
    p.normalize();    
  });
  highlightedRight = [];
}

function restoreContentRightNew() {

}

function partialHighlight(node, startOffset, endOffset, side) {
  const selected = new Range();
  selected.setStart(node, startOffset);
  selected.setEnd(node, endOffset);
  const span = createSpan();
  selected.surroundContents(span);
  if (side == 0 ){
    highlightedLeft.push(span);
  }
  else {
    highlightedRight.push(span);
  }
}

function highlight(node, range, side) {
  if(node === range.startContainer) {
    partialHighlight(node, range.startOffset, node.length, side);
    return 1;
  } else if(node === range.endContainer) {
    partialHighlight(node, 0, range.endOffset, side);
  } else if(node.childNodes.length > 0) {
    for(let i=0; i<node.childNodes.length; i++) {
      const c = node.childNodes[i];
      if(range.intersectsNode(c)) {
        i = i + highlight(c, range, side); //ignore additional children.
      }
    }    
  } else {
    const span = createSpan();
    span.appendChild(node.cloneNode(true));
    node.parentNode.replaceChild(span, node);
    if (side == 0) {
      highlightedLeft.push(span);
    }
    else {
      highlightedRight.push(span);
    }
  }
  return 0;
}

function highlightSelection(range, side) {
  const top = range.commonAncestorContainer;
  //Check whether selection ranges multiple lines, handle accordingly.
  if(top.nodeName === "TBODY") {
    //First/Last TDs may have partial selection. Need to be handled.        
    const lines = []
    for(let i=0; i<top.childNodes.length; i++) {
      const line = top.childNodes[i];
      if(range.intersectsNode(line)){
        lines.push(line);
      }
    }
    //Process partial selection for first/last lines.
    if(lines.length > 0) {
      const code = lines[0].childNodes[1];
      highlight(code, range, side);
    }
    if(lines.length > 1) {
      const code = lines[lines.length-1].childNodes[1];
      highlight(code, range, side);
    }
    
    for(let i=1; i<lines.length-1; i++) {
      let code = lines[i].childNodes[1];
      const span = createSpan();
      if(code.childNodes.length == 1 && code.childNodes[0].nodeName == "SPAN") {
        code = code.childNodes[0];
      }
      code.childNodes.forEach(function(c) {
        span.appendChild(c.cloneNode(true));
      });     
      const newCode = code.cloneNode(false);
      newCode.appendChild(span);
      if (side == 0) {
        highlightedLeft.push(span);
      }
      else {
        highlightedRight.push(span);
      }
      code.parentNode.replaceChild(newCode, code);
    }        
  } else {        
    const span = createSpan();
    const old = range.cloneContents();
    span.appendChild(old);
    range.deleteContents();
    range.insertNode(span);
    if (side == 0) {
      highlightedLeft.push(span);
    }
    else {
      highlightedRight.push(span);
    }
  }  
}

function createSpan() {
  const span = document.createElement('span');
  span.style.backgroundColor = highlightColor;
  return span;
}

let storedSelectionLeft = new Selection();

// this function is deprecated, (-> storeSelectionLeftNew())
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
  let sText = selectionText.toString();
  if(range.toString().length > 0) {
    highlightSelection(range, 0);
  }
  storedSelectionLeft.update(sText, selectionNumber, startPos, sText.length);
}

//       codeText : getDraggedCodeText(selection),
//       length : getDraggedCodeTextLength(selection),
//       startLine : getStartLine(selection),
//       endLine : getEndLine(selection),
//       offsetFromStartLine : getoffsetFromStartLine(selection),
//       offset : getOffset(type)

function storeSelectionLeftNew() {
  // let selectionText = "";
  // let startNum = "";
  // let endNum = "";
  // let selectionNumber = "";
  // let startPos = 0;

  let seletionInfo = getDraggedCodeInfo(storeSelectionLeft, '.left');

  let sText = selectionInfo.codeText;
  let selectionNumber = seletionInfo.startLine;
}

let storedSelectionRight = new Selection();

// this function is deprecated, (-> storeSelectionRightNew())
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

  let range = document.getSelection().getRangeAt(0);
  let sText = selectionText.toString();
  if(range.toString().length > 0) {
    highlightSelection(range, 1);
  }
  storedSelectionRight.update(sText, selectionNumber, startPos, sText.length);
}

function storeSelectionRightNew() {

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
        swal("Please generate Move on left side code.");
    } else if (check == 2) {
        swal("Please generate Move on right side code.");
    } else if (check == 3) {
        swal("Please generate Update on left side code.");
    } else if (check == 4) {
        swal("Please generate Update on right side code.");
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
    if (storedSelectionLeft.len == 0) {
        swal("Please select texts.");
        return;
    }
    let table = document.getElementById("edit_scripts");
    let newRow = table.insertRow();
    newRow.id = storedSelectionLeft.len + "/";

    addEditOp('Delete', newRow, storedSelectionLeft, null, 0);

    storedSelectionLeft.len = 0;
}

function GenInsert() {
    if (storedSelectionRight.len == 0) {
        swal("Please select texts.");
        return;
    }
    let table = document.getElementById("edit_scripts");
    let newRow = table.insertRow();
    newRow.id = "/" + storedSelectionRight.len;

    addEditOp('Insert', newRow, null, storedSelectionRight, 0);

    storedSelectionRight.len = 0;
}

function GenMoveLeft() {
    if (storedSelectionLeft.len == 0) {
        swal("Please select texts on the left side.");
        return;
    } else if (storedSelectionRight.len == 0) {
        swal("Please select texts on the right side.");
        return;
    }

    let table = document.getElementById("edit_scripts");
    let newRow = table.insertRow();
    newRow.id = storedSelectionLeft.len + "/" + storedSelectionRight.len;

    addEditOp('Move', newRow, storedSelectionLeft, storedSelectionRight, 1);

    check = 0;

    storedSelectionLeft.len = 0;
    storedSelectionRight.len = 0;
}

function GenMoveRight() {
    if (storedSelectionRight.len == 0) {
        swal("Please select texts on the right side.");
        return;
    } else if (storedSelectionLeft.len == 0) {
        swal("Please select texts on the left side.");
        return;
    }

    let table = document.getElementById("edit_scripts");
    let newRow = table.insertRow();
    newRow.id = storedSelectionLeft.len + "/" + storedSelectionRight.len;

    addEditOp('Move', newRow, storedSelectionLeft, storedSelectionRight, 1);

    check = 0;

    storedSelectionLeft.len = 0;
    storedSelectionRight.len = 0;
}

function GenUpdateLeft() {
    if (storedSelectionLeft.len == 0) {
        swal("Please select texts on the left side.");
        return;
    } else if (storedSelectionRight.len == 0) {
        swal("Please select texts on the right side.");
        return;
    }
    
    let table = document.getElementById("edit_scripts");
    let newRow = table.insertRow();
    newRow.id = storedSelectionLeft.len +  "/" + storedSelectionRight.len;

    addEditOp('Update', newRow, storedSelectionLeft, storedSelectionRight, 1);

    check = 0;

    storedSelectionLeft.len = 0;
    storedSelectionRight.len = 0;
}

function GenUpdateRight() {
    if (storedSelectionRight.len == 0) {
        swal("Please select texts on the right side.");
        return;
    } else if (storedSelectionLeft.len == 0) {
        swal("Please select texts on the left side.");
        return;
    }

    let table = document.getElementById("edit_scripts");
    let newRow = table.insertRow();
    newRow.id =  storedSelectionLeft.len + "/" + storedSelectionRight.len;

    addEditOp('Update', newRow, storedSelectionLeft, storedSelectionRight, 1);

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

    if (document.getElementById("current").value.includes('tutorial')) {
      table.deleteRow(rowNum); return;
    }

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
}