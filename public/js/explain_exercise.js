let hintCnt = 0;

let genControllerType = new Array();

function isEditSriptExist() {
    let values = document.querySelectorAll('table#edit_scripts tr');
    return values.length >= 2;
}

function initExplainExercise() {
    var value = document.getElementById("current").value;

    if (value == "tutorial003")
        genControllerType = [0, 1];
    else if (value == "tutorial004")
        genControllerType = [2, 3, 4, 5];
}

function exGenDelete(selectResult) {
    if (document.getElementById("current").value != 'tutorial003') {
      swal("This example does not allow Delete script."); return;
    }

    if (selectResult.len == 0) {
        swal("Please select texts.");
        return;
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
    if (document.getElementById("current").value != 'tutorial003') {
      swal("This example does not allow Insert script."); return;
    }
  
    if (selectResult.len == 0) {
        swal("Please select texts.");
        return;
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
    if (document.getElementById("current").value != 'tutorial004') {
        swal("This example does not allow Move script."); return;
      }

    if (selectResult.len == 0) {
        swal("Please select texts on the left side.");
        return;
    } else if (storedSelectionRight.len == 0) {
        swal("Please select texts on the right side.");
        return;
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
    if (document.getElementById("current").value != 'tutorial004') {
        swal("This example does not allow Update script."); return;
      }

    if (selectResult.len == 0) {
        swal("Please select texts on the left side.");
        return;
    } else if (storedSelectionRight.len == 0) {
        swal("Please select texts on the right side.");
        return;
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
        url: '/survey/userInfo',
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