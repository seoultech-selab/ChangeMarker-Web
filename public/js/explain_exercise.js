let hintCnt = 0;

let genControllerType = [0];

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

    let currentPageNum = Number(window.parent.document.getElementById('current_page').innerText);
    if (checkExercise.value < currentPageNum) {
      $.ajax({
        type: 'put',
        url: '/survey/userInfo',
        data: {status : 'explain' + currentPageNum},
        dataType : 'json',
        success: function(res) {}
      });
    }
    checkExercise.value = Math.max(currentPageNum, checkExercise.value);
    let nextButton = window.parent.document.getElementById('next_button');
    nextButton.style.color = "#393E46";
    nextButton.disabled = false;
}