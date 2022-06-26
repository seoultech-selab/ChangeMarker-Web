let hintCnt = 0;

let genControllerType = [4, 5];

function GenUpdateLeft() {
  let selectResult = storedSelectionLeft;
  if (selectResult.len == 0) {
      alert("Please select texts on the left side.");
      return;
  } else if (storedSelectionRight.len == 0) {
      alert("Please select texts on the right side.");
      return;
  }
  
  if (selectResult.text.trim() != "BlockServiceHandler") {
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
      alert('The changed code on the left side is "BlockServiceHandler".');
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
      alert('Check the correct answer.');
    }
  }
  
  if (storedSelectionRight.text.trim() != 'BlockWorkerClientServiceHandler') {
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
      alert('The changed code on the right side is "BlockWorkerClientServiceHandler".');
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
      alert('Check the correct answer.');
    }
  }
  else {
    alert("Correct!! The next button is activated.");
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

  let checkExercise = window.parent.document.getElementById('checkExercise');
  let currentPageNum = Number(window.parent.document.getElementById('current_page').innerText);
  checkExercise.value = currentPageNum;
  let nextButton = window.parent.document.getElementById('next_button');
  nextButton.style.color = "#393E46";
  nextButton.disabled = false;
}

function GenUpdateRight() {
  let selectResult = storedSelectionRight;
  if (selectResult.len == 0) {
      alert("Please select texts on the right side.");
      return;
  } else if (storedSelectionLeft.len == 0) {
      alert("Please select texts on the left side.");
      return;
  }

  if (selectResult.text.indexOf('BlockWorkerClientServiceHandler', 0) < 0 || selectResult.len > 33) {
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
      alert('The changed code on the right side is "BlockWorkerClientServiceHandler".');
      return;
    }
    else {
      selectResult.len = 31;
      selectResult.startPos = 0;
      selectResult.text = 'BlockWorkerClientServiceHandler';
      selectResult.lineNum = 29;
      
      storedSelectionLeft.len = 19;
      storedSelectionLeft.startPos = 0;
      storedSelectionLeft.text = 'BlockServiceHandler';
      storedSelectstoredSelectionRightionLeft.lineNum = 29;
      alert('Check the correct answer.');
    }
  }
  
  if (storedSelectionLeft.text.indexOf('BlockServiceHandler', 0) < 0 || storedSelectionLeft.len > 21) {
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
      alert('The changed code on the left side is "BlockServiceHandler".');
      return;
    }
    else {
      selectResult.len = 31;
      selectResult.startPos = 0;
      selectResult.text = 'BlockWorkerClientServiceHandler';
      selectResult.lineNum = 29;
      
      storedSelectionLeft.len = 19;
      storedSelectionLeft.startPos = 0;
      storedSelectionLeft.text = 'BlockServiceHandler';
      storedSelectstoredSelectionRightionLeft.lineNum = 29;
      alert('Check the correct answer.');
    }
  }
  else {
    alert("Correct!! The next button is activated.");
  }

  let table = document.getElementById("edit_scripts");
  let newRow = table.insertRow();
  selectResult = storedSelectionRight;
  newRow.id = storedSelectionLeft.len + "/" + selectResult.len;

  let newATag = createDeleteButton(0);


  let newCell1 = newRow.insertCell(0);
  let newCell2 = newRow.insertCell(1);
  let newCell3 = newRow.insertCell(2);
  let newCell4 = newRow.insertCell(3);
  let newCell5 = newRow.insertCell(4);
  let newCell6 = newRow.insertCell(5);

  newCell1.innerText = 'Update';
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