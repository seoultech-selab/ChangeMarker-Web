let storedSelectionLeft = new Object();
storedSelectionLeft.len = 0;

let storedSelectionRight = new Object();
storedSelectionRight.len = 0;

let tmpStartPos = 0;
let tmpLen = 0;

let hintCnt = 0;

let selectResult = new Object();

let storedSelectStartPos = 0;
let storedSelectLines = new Array();

let genControllerType = [0];

function GenDelete() {
  let selectResult = getSelectResult();
    if (selectResult.len == 0) {
        alert("Please select texts.");
        return;
    }

    let checkExercise = window.parent.document.getElementById('checkExercise');
    if (selectResult.text.indexOf('super(settings);', 0) < 0) {
      hintCnt += 1;
      if (hintCnt == 1) {
        alert('Check the selection again.');
        return;
      }
      else if (hintCnt == 2) {
        alert('Check the selection again. Look carefully the red highlighted line.');
        return;
      }
      else if (hintCnt == 3) {
        alert('The changed code is "super(settings);".');
        return;
      }
      else {
        selectResult.len = 16;
        selectResult.startPos = 0;
        selectResult.text = 'super(settings);';
        selectResult.lineNum = 15;
        alert('Check the correct answer.');

      }
    }
    else {
      alert("Correct!! The next button is activated.");
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
    checkExercise.value = currentPageNum;
    let nextButton = window.parent.document.getElementById('next_button');
    nextButton.style.color = "#393E46";
    nextButton.disabled = false;
}