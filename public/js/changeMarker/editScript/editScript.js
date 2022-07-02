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
      scriptJSON.old_code = leftSel.codeText;
      scriptJSON.line_number_old = leftSel.startLine;
      scriptJSON.start_pos_old = leftSel.offsetFromStartLine;
      scriptJSON.length_old = leftSel.length;  
    }
    if(rightSel) {
      cellNewCode.innerText = rightSel.codeText;
      cellNewLine.innerText = rightSel.startLine;
      scriptJSON.new_code = rightSel.codeText;
      scriptJSON.line_number_new = rightSel.startLine;
      scriptJSON.start_pos_new = rightSel.offsetFromStartLine;
      scriptJSON.length_new = rightSel.length;
    }
  
    let newATag = createDeleteButton(delType);
    cellLink.appendChild(newATag);
  
    scriptJSON.user_code = document.getElementById("userCode").value;
    scriptJSON.type = opType;
    scriptJSON.change_id = document.getElementById("current").value;
    oneScriptSubmit(scriptJSON);
}








function insertTableRow(opType, delType) {
    let table = document.querySelector("edit_scripts");
    let newRow = table.insertRow();

    let oldCode = oldDraggedCodeInfo.codeText;
    let oldStartLine = oldDraggedCodeInfo.startLine;
    let oldCodeLength = oldDraggedCodeInfo.length;

    let newCode = newDraggedCodeInfo.codeText;
    let newStartLine = newDraggedCodeInfo.startLine;
    let newCodeLength = newDraggedCodeInfo.length;


    newRow.id = 
        (oldCodeLength == -1) ? "" : oldCodeLength
         + "/" 
         + (newCodeLength == -1) ? "" : newCodeLength;


    let cellType = newRow.insertCell(0);

    let cellOldCode = newRow.insertCell(1);
    let cellOldStartLine = newRow.insertCell(2);

    let cellNewCode = newRow.insertCell(3);
    let cellNewStartLine = newRow.insertCell(4);

    let cellOption = newRow.insertCell(5);


    cellType.innerText = opType;

    cellOldCode.innerText = oldCode;
    cellOldStartLine.innerText = oldStartLine;

    cellNewCode.innerText = newCode;
    cellNewStartLine.innerText = newStartLine;

    let deleteButton = createDeleteButton(delType);
    cellOption.appendChild(deleteButton);


    insertScriptDB(opType);
}

function insertScriptDB(opType) {
    let scriptJSON = {
        user_code : document.getElementById("userCode").value,
        type : opType,
        change_id : document.getElementById("current").value,

        old_code : oldDraggedCodeInfo.codeText,
        line_number_old : oldDraggedCodeInfo.startLine,
        start_pos_old : oldDraggedCodeInfo.offsetFromStartLine,
        length_old : oldDraggedCodeInfo.length,

        new_code : newDraggedCodeInfo.codeText,
        line_number_new : newDraggedCodeInfo.startLine,
        start_pos_new : newDraggedCodeInfo.offsetFromStartLine,
        length_new : newDraggedCodeInfo.length,
    };

    oneScriptSubmit(scriptJSON);
}
