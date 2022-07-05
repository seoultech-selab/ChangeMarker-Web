function scriptDBInsert() {
    let table = document.getElementById("edit_scripts");
    let newRow = table.insertRow();
    newRow.id = "/" + newDraggedCodeInfo.length;

    addDB('Insert', newRow, null, newDraggedCodeInfo, 0);

}

function scriptDBDelete() {

    let table = document.getElementById("edit_scripts");
    let newRow = table.insertRow();
    newRow.id = oldDraggedCodeInfo.length + "/";

    addDB('Delete', newRow, oldDraggedCodeInfo, null, 0);
}

function scriptDBMove() {
    let table = document.getElementById("edit_scripts");
    let newRow = table.insertRow();
    newRow.id = oldDraggedCodeInfo.length + "/" + newDraggedCodeInfo.length;

    addDB('Move', newRow, oldDraggedCodeInfo, newDraggedCodeInfo, 1);
    
    check = 0;
}

function scriptDBUpdate() {
    let table = document.getElementById("edit_scripts");
    let newRow = table.insertRow();
    newRow.id = oldDraggedCodeInfo.length +  "/" + newDraggedCodeInfo.length;

    addDB('Update', newRow, oldDraggedCodeInfo, newDraggedCodeInfo, 1);
}

function addDB(opType, newRow, leftSel, rightSel, delType) {
    let cellOpType = newRow.insertCell(0);
    let cellOldCode = newRow.insertCell(1);
    let cellOldLine = newRow.insertCell(2);
    let cellNewCode = newRow.insertCell(3);
    let cellNewLine = newRow.insertCell(4);
    let cellLink = newRow.insertCell(5);
    let scriptJSON = new Object();
    
    cellOpType.innerText = opType;
    if(leftSel) {
      cellOldCode.innerText = leftSel.codeText;
      cellOldLine.innerText = leftSel.startLine;  
      scriptJSON.old_code = convertToDBText(leftSel.codeText);
      scriptJSON.line_number_old = leftSel.startLine;
      scriptJSON.start_pos_old = leftSel.offset;
      scriptJSON.length_old = leftSel.length;  
    }
    if(rightSel) {
      cellNewCode.innerText = rightSel.codeText;
      cellNewLine.innerText = rightSel.startLine;
      scriptJSON.new_code = convertToDBText(rightSel.codeText);
      scriptJSON.line_number_new = rightSel.startLine;
      scriptJSON.start_pos_new = rightSel.offset;
      scriptJSON.length_new = rightSel.length;
    }
  
    let newATag = createDeleteButton(delType);
    cellLink.appendChild(newATag);
  
    scriptJSON.user_code = document.getElementById("userCode").value;
    scriptJSON.type = opType;
    scriptJSON.change_id = document.getElementById("current").value;
    oneScriptSubmit(scriptJSON);
}

const DBText = [
    "<",
    ">"
]

const htmlText = [
    "&lt;",
    "&gt;"
];

function convertToDBText(s) {
    s = s.replace(/&lt;/g, "<");
    s = s.replace(/&gt;/g, ">");
    return s;
}