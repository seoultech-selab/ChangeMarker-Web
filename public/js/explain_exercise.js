let hintCnt = 0;

let genControllerType = new Array();

function isEditSriptExist() {
    let values = document.querySelectorAll('table#edit_scripts tr');
    return values.length >= 2;
}

function initExplainExercise() {
    var value = document.getElementById("current").value;

    if (value == "tutorial004")
        genControllerType = [0];
    else if (value == "tutorial005")
        genControllerType = [1];
    else if (value == "tutorial006")
        genControllerType = [2, 3];
    else if (value == "tutorial007")
        genControllerType = [4, 5];
}

function exGenDelete(selectResult) {
    if (document.getElementById("current").value != 'tutorial004') {
      swal("This example does not allow Delete script."); return;
    }

    if (selectResult.len == 0) {
        swal("Please select texts.");
        return;
    }

    let checkExercise = window.parent.document.getElementById('checkExercise');
    if (selectResult.text.trim() != "super(settings);") {
      hintCnt += 1;
      if (hintCnt == 1) {
        swal('Check the selection again.');
        return;
      }
      else if (hintCnt == 2) {
        swal('Check the selection again. Look carefully the red highlighted line.');
        return;
      }
      else if (hintCnt == 3) {
        swal('The changed code is "super(settings);".');
        return;
      }
      else {
        selectResult.len = 16;
        selectResult.startPos = 0;
        selectResult.text = 'super(settings);';
        selectResult.lineNum = 15;
        swal('Check the correct answer.');
      }
    }
    else {
      swal("Correct!! The next button is activated.");
    }

    if (isEditSriptExist()) {
      return;
    }

    let table = document.getElementById("edit_scripts");
    let newRow = table.insertRow();
    newRow.id = selectResult.len + "/:" + selectResult.startPos + "/";

    let newATag = createDeleteButton(0);

    let newCell1 = newRow.insertCell(0);
    let newCell2 = newRow.insertCell(1);
    let newCell3 = newRow.insertCell(2);
    let newCell4 = newRow.insertCell(3);
    let newCell5 = newRow.insertCell(4);
    let newCell6 = newRow.insertCell(5);

    newCell1.innerText = 'Delete';
    let preTag = document.createElement('pre');
    preTag.innerHTML = selectResult.text;
    newCell2.appendChild(preTag);
    newCell3.innerText = selectResult.lineNum;
    newCell6.appendChild(newATag);

    updateCheckExercise();
}

function GenInsert(selectResult) {
    if (document.getElementById("current").value != 'tutorial005') {
      swal("This example does not allow Insert script."); return;
    }
  
    if (selectResult.len == 0) {
        swal("Please select texts.");
        return;
    }
  
    if (selectResult.text.trim() != "this.routing = routing;") {
      hintCnt += 1;
      if (hintCnt == 1) {
        swal('Check the selection again.');
        return;
      }
      else if (hintCnt == 2) {
        swal('Check the selection again. Look carefully the green highlighted line.');
        return;
      }
      else if (hintCnt == 3) {
        swal('The changed code is "this.routing = routing;".');
        return;
      }
      else {
        selectResult.len = 16;
        selectResult.startPos = 0;
        selectResult.text = 'this.routing = routing;';
        selectResult.lineNum = 15;
        swal('Check the correct answer.');
  
      }
    }
    else {
      swal("Correct!! The next button is activated.");
    }

    if (isEditSriptExist()) {
      return;
    }
  
    let table = document.getElementById("edit_scripts");
    let newRow = table.insertRow();
    newRow.id = "/" + selectResult.len + ":/" + selectResult.startPos;
  
    let newATag = createDeleteButton(0);
  
  
    let newCell1 = newRow.insertCell(0);
    let newCell2 = newRow.insertCell(1);
    let newCell3 = newRow.insertCell(2);
    let newCell4 = newRow.insertCell(3);
    let newCell5 = newRow.insertCell(4);
    let newCell6 = newRow.insertCell(5);
  
    newCell1.innerText = 'Insert';
    let preTag = document.createElement('pre');
    preTag.innerHTML = selectResult.text;
    newCell4.appendChild(preTag);
    newCell5.innerText = selectResult.lineNum;
    newCell6.appendChild(newATag);
  
    updateCheckExercise();
  }

  function GenMoveLeft(selectResult, storedSelectionRight) {
    if (document.getElementById("current").value != 'tutorial006') {
        swal("This example does not allow Move script."); return;
      }

    if (selectResult.len == 0) {
        swal("Please select texts on the left side.");
        return;
    } else if (storedSelectionRight.len == 0) {
        swal("Please select texts on the right side.");
        return;
    }
  
    if (selectResult.text.trim() != 'Properties props = new Properties();') {
      hintCnt += 1;
      if (hintCnt == 1) {
        swal('Check the selection on the left side again.');
        return;
      }
      else if (hintCnt == 2) {
        swal('Check the selection on the left side again. Look carefully the red highlighted line.');
        return;
      }
      else if (hintCnt == 3) {
        swal('The changed code is "Properties props = new Properties();".');
        return;
      }
      else {
        selectResult.len = 36;
        selectResult.startPos = 0;
        selectResult.text = 'Properties props = new Properties();';
        selectResult.lineNum = 33;
        
        storedSelectionRight.len = 36;
        storedSelectionRight.startPos = 0;
        storedSelectionRight.text = 'Properties props = new Properties();';
        storedSelectstoredSelectionRightionLeft.lineNum = 35;
        swal('Check the correct answer.');
      }
    }
    
    if (storedSelectionRight.text.trim() != 'Properties props = new Properties();') {
      hintCnt += 1;
      if (hintCnt == 1) {
        swal('Check the selection on the right side again.');
        return;
      }
      else if (hintCnt == 2) {
        swal('Check the selection on the right side again. Look carefully the green highlighted line.');
        return;
      }
      else if (hintCnt == 3) {
        swal('The changed code is "Properties props = new Properties();".');
        return;
      }
      else {
        selectResult.len = 36;
        selectResult.startPos = 0;
        selectResult.text = 'Properties props = new Properties();';
        selectResult.lineNum = 33;
        
        storedSelectionRight.len = 36;
        storedSelectionRight.startPos = 0;
        storedSelectionRight.text = 'Properties props = new Properties();';
        storedSelectionRight.lineNum = 35;
        swal('Check the correct answer.');
      }
    }
    else {
      swal("Correct!! The next button is activated.");
    }

    if (isEditSriptExist()) {
      return;
    }
  
    let table = document.getElementById("edit_scripts");
    let newRow = table.insertRow();
    selectResult = storedSelectionRight;
    newRow.id = storedSelectionRight.len + "/" + selectResult.len;
  
    let newATag = createDeleteButton(0);
  
  
    let newCell1 = newRow.insertCell(0);
    let newCell2 = newRow.insertCell(1);
    let newCell3 = newRow.insertCell(2);
    let newCell4 = newRow.insertCell(3);
    let newCell5 = newRow.insertCell(4);
    let newCell6 = newRow.insertCell(5);
  
    newCell1.innerText = 'Move';
    newCell2.innerText = selectResult.text;
    newCell3.innerText = selectResult.lineNum;
    newCell4.innerText = storedSelectionRight.text;
    newCell5.innerText = storedSelectionRight.lineNum;
    newCell6.appendChild(newATag);
  
    updateCheckExercise();
  }

  function GenUpdateLeft(selectResult, storedSelectionRight) {
    if (document.getElementById("current").value != 'tutorial007') {
        swal("This example does not allow Update script."); return;
      }

    if (selectResult.len == 0) {
        swal("Please select texts on the left side.");
        return;
    } else if (storedSelectionRight.len == 0) {
        swal("Please select texts on the right side.");
        return;
    }
    
    if (selectResult.text.trim() != "BlockServiceHandler") {
      hintCnt += 1;
      if (hintCnt == 1) {
        swal('Check the selection on the left side again.');
        return;
      }
      else if (hintCnt == 2) {
        swal('Check the selection on the left side again. Look carefully the red highlighted line.');
        return;
      }
      else if (hintCnt == 3) {
        swal('The changed code on the left side is "BlockServiceHandler".');
        return;
      }
      else {
        selectResult.len = 19;
        selectResult.startPos = 0;
        selectResult.text = 'BlockServiceHandler';
        selectResult.lineNum = 29;
        
        storedSelectionRight.len = 31;
        storedSelectionRight.startPos = 0;
        storedSelectionRight.text = 'BlockWorkerClientServiceHandler';
        storedSelectstoredSelectionRightionLeft.lineNum = 29;
        swal('Check the correct answer.');
      }
    }
    
    if (storedSelectionRight.text.trim() != 'BlockWorkerClientServiceHandler') {
      hintCnt += 1;
      if (hintCnt == 1) {
        swal('Check the selection on the right side again.');
        return;
      }
      else if (hintCnt == 2) {
        swal('Check the selection on the right side again. Look carefully the green highlighted line.');
        return;
      }
      else if (hintCnt == 3) {
        swal('The changed code on the right side is "BlockWorkerClientServiceHandler".');
        return;
      }
      else {
        selectResult.len = 19;
        selectResult.startPos = 0;
        selectResult.text = 'BlockServiceHandler';
        selectResult.lineNum = 29;
        
        storedSelectionRight.len = 31;
        storedSelectionRight.startPos = 0;
        storedSelectionRight.text = 'BlockWorkerClientServiceHandler';
        storedSelectstoredSelectionRightionLeft.lineNum = 29;
        swal('Check the correct answer.');
      }
    }
    else {
      swal("Correct!! The next button is activated.");
    }

    if (isEditSriptExist()) {
      return;
    }
  
    let table = document.getElementById("edit_scripts");
    let newRow = table.insertRow();
    selectResult = storedSelectionRight;
    newRow.id = storedSelectionRight.len + "/" + selectResult.len;
  
    let newATag = document.createElement('a');
    newATag.href = "javascript:void(0)";
    newATag.text = "Delete";
    newATag.className = "del_btn";
    newATag.onclick = function() {exDeleteRow(this, 1);};
  
  
    let newCell1 = newRow.insertCell(0);
    let newCell2 = newRow.insertCell(1);
    let newCell3 = newRow.insertCell(2);
    let newCell4 = newRow.insertCell(3);
    let newCell5 = newRow.insertCell(4);
    let newCell6 = newRow.insertCell(5);
  
    newCell1.innerText = 'Update';
    newCell2.innerText = selectResult.text;
    newCell3.innerText = selectResult.lineNum;
    newCell4.innerText = storedSelectionRight.text;
    newCell5.innerText = storedSelectionRight.lineNum;
    newCell6.appendChild(newATag);
  
    updateCheckExercise();
  }

  function updateCheckExercise() {
    let checkExercise = document.getElementById('checkExercise');
    let currentPageNum = Number(document.getElementById('current_page').innerText) + 1;
    if (checkExercise.value < currentPageNum) {
      $.ajax({
        type: 'put',
        url: getPathname() + '/survey/userInfo',
        data: {status : 'tutorial00' + currentPageNum},
        dataType : 'json',
        success: function(res) {}
      });
    }
    checkExercise.value = Math.max(currentPageNum, checkExercise.value);
    let nextButton = window.parent.document.getElementById('next_button');
    nextButton.style.color = "#393E46";
    nextButton.disabled = false;
  }