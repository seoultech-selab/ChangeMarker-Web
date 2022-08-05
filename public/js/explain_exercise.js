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

    if (selectResult.text.trim() != "super(settings);") {
      swal("Check the selection again.");
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

    if (table.querySelectorAll("tr").length == 3)
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

    if (selectResult.text.trim() != "set.add(indexShard.shardsRandomIt());") {
      swal("Check the selection again.");
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
  
    if (table.querySelectorAll("tr").length == 3)
      updateCheckExercise();
  }

  function GenMoveLeft(oldCodeInfo, newCodeInfo) {
    if (document.getElementById("current").value != 'tutorial004') {
        swal("This example does not allow Move script."); return;
      }

    if (oldCodeInfo.len == 0) {
        swal("Please select texts on the left side.");
        return;
    } else if (newCodeInfo.len == 0) {
        swal("Please select texts on the right side.");
        return;
    }

    if (oldCodeInfo.text.trim() != "int tmp = arr[j];") {
      swal("Check the selection again.");
      return;
    }
    if (newCodeInfo.text.trim() != "int tmp = arr[j];") {
        swal("Check the selection again.");
        return;
    }
  
    let table = document.getElementById("edit_scripts");
    let newRow = table.insertRow();

    newRow.id = newCodeInfo.len + "/" + oldCodeInfo.len;
  
    let newATag = createDeleteButton(0);

    let newCell1 = newRow.insertCell(0);
    let newCell2 = newRow.insertCell(1);
    let newCell3 = newRow.insertCell(2);
    let newCell4 = newRow.insertCell(3);
    let newCell5 = newRow.insertCell(4);
    let newCell6 = newRow.insertCell(5);
  
    newCell1.innerText = 'Move';
    newCell2.innerText = oldCodeInfo.text;
    newCell3.innerText = oldCodeInfo.lineNum;
    newCell4.innerText = newCodeInfo.text;
    newCell5.innerText = newCodeInfo.lineNum;
    newCell6.appendChild(newATag);
  
    if (table.querySelectorAll("tr").length == 3)
      updateCheckExercise();
  }

  function GenUpdateLeft(oldCodeInfo, newCodeInfo) {
    if (document.getElementById("current").value != 'tutorial004') {
        swal("This example does not allow Update script."); return;
      }

    console.log(oldCodeInfo);
    console.log(newCodeInfo);

    if (oldCodeInfo.len == 0) {
        swal("Please select texts on the left side.");
        return;
    } else if (newCodeInfo.len == 0) {
        swal("Please select texts on the right side.");
        return;
    }

    if (oldCodeInfo.text.trim() != "arr[j] = arr[i+1];") {
        swal("Check the selection again.");
        return;
    }
    if (newCodeInfo.text.trim() != "arr[j] = arr[j+1];") {
        swal("Check the selection again.");
        return;
    }
  
    let table = document.getElementById("edit_scripts");
    let newRow = table.insertRow();

    newRow.id = newCodeInfo.len + "/" + oldCodeInfo.len;
  
    let newATag = createDeleteButton(0);
  
  
    let newCell1 = newRow.insertCell(0);
    let newCell2 = newRow.insertCell(1);
    let newCell3 = newRow.insertCell(2);
    let newCell4 = newRow.insertCell(3);
    let newCell5 = newRow.insertCell(4);
    let newCell6 = newRow.insertCell(5);
  
    newCell1.innerText = 'Update';
    newCell2.innerText = oldCodeInfo.text;
    newCell3.innerText = oldCodeInfo.lineNum;
    newCell4.innerText = newCodeInfo.text;
    newCell5.innerText = newCodeInfo.lineNum;
    newCell6.appendChild(newATag);
  
    if (table.querySelectorAll("tr").length == 3)
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