let storedSelectionLeft = new Object();
storedSelectionLeft.len = 0;

let storedSelectionRight = new Object();
storedSelectionRight.len = 0;

let tmpStartPos = 0;
let tmpLen = 0

let hintCnt = 0;

let selectResult = new Object();

let storedSelectStartPos = 0;
let storedSelectLines = new Array();

let genControllerType = [2, 3];

function GenMoveLeft() {
  let selectResult = getSelectResult();
  if (getSelectResult().len == 0) {
      alert("Please select texts on the left side.");
      return;
  } else if (storedSelectionRight.len == 0) {
      alert("Please select texts on the right side.");
      return;
  }

  if (selectResult.text.indexOf('Properties props = new Properties();', 0) < 0) {
    hintCnt += 1;
    if (hintCnt == 1) {
      alert('Check the selection on the left side again.');
      return;
    }
    else if (hintCnt == 2) {
      alert('Check the selection on the left side again. Look carefully the red highlighted line.');
      return;
    }
    else if (hintCnt == 3) {
      alert('The changed code is "Properties props = new Properties();".');
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
      alert('Check the correct answer.');
    }
  }
  
  if (storedSelectionRight.text.indexOf('Properties props = new Properties();', 0) < 0) {
    hintCnt += 1;
    if (hintCnt == 1) {
      alert('Check the selection on the right side again.');
      return;
    }
    else if (hintCnt == 2) {
      alert('Check the selection on the right side again. Look carefully the green highlighted line.');
      return;
    }
    else if (hintCnt == 3) {
      alert('The changed code is "Properties props = new Properties();".');
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
      alert('Check the correct answer.');
    }
  }
  else {
    alert("Correct!! The next button is activated.");
  }

  let table = document.getElementById("edit_scripts");
  let newRow = table.insertRow();
  selectResult = getSelectResult();
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

  let checkExercise = window.parent.document.getElementById('checkExercise');
  let currentPageNum = Number(window.parent.document.getElementById('current_page').innerText);
  checkExercise.value = currentPageNum;
  let nextButton = window.parent.document.getElementById('next_button');
  nextButton.style.color = "#393E46";
  nextButton.disabled = false;
}

function GenMoveRight() {
  let selectResult = getSelectResult();
  if (getSelectResult().len == 0) {
      alert("Please select texts on the right side.");
      return;
  } else if (storedSelectionLeft.len == 0) {
      alert("Please select texts on the left side.");
      return;
  }

  if (selectResult.text.indexOf('Properties props = new Properties();', 0) < 0) {
    hintCnt += 1;
    if (hintCnt == 1) {
      alert('Check the selection on the right side again.');
      return;
    }
    else if (hintCnt == 2) {
      alert('Check the selection on the right side again. Look carefully the green highlighted line.');
      return;
    }
    else if (hintCnt == 3) {
      alert('The changed code is "Properties props = new Properties();".');
      return;
    }
    else {
      selectResult.len = 36;
      selectResult.startPos = 0;
      selectResult.text = 'Properties props = new Properties();';
      selectResult.lineNum = 33;
      
      storedSelectionLeft.len = 36;
      storedSelectionLeft.startPos = 0;
      storedSelectionLeft.text = 'Properties props = new Properties();';
      storedSelectionLeft.lineNum = 35;
      alert('Check the correct answer.');
    }
  }
  
  if (storedSelectionLeft.text.indexOf('Properties props = new Properties();', 0) < 0) {
    hintCnt += 1;
    if (hintCnt == 1) {
      alert('Check the selection on the left side again.');
      return;
    }
    else if (hintCnt == 2) {
      alert('Check the selection on the left side again. Look carefully the red highlighted line.');
      return;
    }
    else if (hintCnt == 3) {
      alert('The changed code is "Properties props = new Properties();".');
      return;
    }
    else {
      selectResult.len = 36;
      selectResult.startPos = 0;
      selectResult.text = 'Properties props = new Properties();';
      selectResult.lineNum = 35;
      
      storedSelectionLeft.len = 36;
      storedSelectionLeft.startPos = 0;
      storedSelectionLeft.text = 'Properties props = new Properties();';
      storedSelectionLeft.lineNum = 35;
      alert('Check the correct answer.');
    }
  }
  else {
    alert("Correct!! The next button is activated.");
  }

  let table = document.getElementById("edit_scripts");
  let newRow = table.insertRow();
  selectResult = getSelectResult();
  newRow.id = storedSelectionLeft.len + "/" + selectResult.len;

  let newATag = document.createElement('a');
  newATag.href = "javascript:void(0)";
  newATag.text = "Delete";
  newATag.className = "del_btn";
  newATag.onclick = function() {deleteRow(this, 1);};


  let newCell1 = newRow.insertCell(0);
  let newCell2 = newRow.insertCell(1);
  let newCell3 = newRow.insertCell(2);
  let newCell4 = newRow.insertCell(3);
  let newCell5 = newRow.insertCell(4);
  let newCell6 = newRow.insertCell(5);

  newCell1.innerText = 'Move';
  newCell2.innerText = storedSelectionLeft.text;
  newCell3.innerText = storedSelectionLeft.lineNum;
  newCell4.innerText = selectResult.text;
  newCell5.innerText = selectResult.lineNum;
  newCell6.appendChild(newATag);

  let checkExercise = window.parent.document.getElementById('checkExercise');
  let currentPageNum = Number(window.parent.document.getElementById('current_page').innerText);
  checkExercise.value = currentPageNum;
  let nextButton = window.parent.document.getElementById('next_button');
  nextButton.style.color = "#393E46";
  nextButton.disabled = false;
}