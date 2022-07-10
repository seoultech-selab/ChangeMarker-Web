let hintCnt = 0;

let genControllerType = [1];

function GenInsert(selectResult) {
  if (document.getElementById("current").value != 'tutorial5') {
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

  let checkExercise = window.parent.document.getElementById('checkExercise');
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