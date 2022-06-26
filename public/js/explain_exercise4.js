let hintCnt = 0;

let genControllerType = [1];

function GenInsert() {
  let selectResult = storedSelectionRight;
  if (selectResult.len == 0) {
      alert("Please select texts.");
      return;
  }

  if (selectResult.text.trim() != "this.routing = routing;") {
    hintCnt += 1;
    if (hintCnt == 1) {
      alert('Check the selection again.');
      return;
    }
    else if (hintCnt == 2) {
      alert('Check the selection again. Look carefully the green highlighted line.');
      return;
    }
    else if (hintCnt == 3) {
      alert('The changed code is "this.routing = routing;".');
      return;
    }
    else {
      selectResult.len = 16;
      selectResult.startPos = 0;
      selectResult.text = 'this.routing = routing;';
      selectResult.lineNum = 15;
      alert('Check the correct answer.');

    }
  }
  else {
    alert("Correct!! The next button is activated.");
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
  checkExercise.value = currentPageNum;
  let nextButton = window.parent.document.getElementById('next_button');
  nextButton.style.color = "#393E46";
  nextButton.disabled = false;
}