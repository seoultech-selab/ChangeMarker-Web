let standardHeight = 0;

function setStandardHeight() {
  standardHeight = window.innerHeight;
}


let storedSelectionLeft = new Object();
storedSelectionLeft.len = 0;

function storeSelectionLeft() {
  let result = new Object();
  let selectionText = "";
  let startNum = "";
  let endNum = "";
  let selectionNumber = "";
  let startPos = 0;

  if (document.getSelection) {
    selectionText = document.getSelection();
    startPos = selectionText.getRangeAt(0).startOffset;
  } else if (document.selection) {
    selectionText = document.selection.createRange().text;
  }

  if (document.getSelection().anchorNode.parentElement.attributes.length == 2 && !(document.getSelection().anchorNode.parentElement.attributes[1].value.includes('#'))) {
    startNum = document.getSelection().anchorNode.parentElement.attributes[1].value;
  } else if (document.getSelection().anchorNode.parentElement.firstChild.parentNode.offsetParent.attributes.length == 2 && !(document.getSelection().anchorNode.parentElement.firstChild.parentNode.offsetParent.attributes[1].value.includes('#'))) {
    startNum = document.getSelection().anchorNode.parentElement.firstChild.parentNode.offsetParent.attributes[1].value;
  }

  if (document.getSelection().focusNode.parentElement.attributes.length == 2 && !(document.getSelection().focusNode.parentElement.attributes[1].value.includes('#'))) {
    endNum = document.getSelection().focusNode.parentElement.attributes[1].value;
  } else if (document.getSelection().focusNode.parentElement.firstChild.parentNode.offsetParent.attributes.length == 2 && !(document.getSelection().focusNode.parentElement.firstChild.parentNode.offsetParent.attributes[1].value.includes('#'))) {
    endNum = document.getSelection().focusNode.parentElement.firstChild.parentNode.offsetParent.attributes[1].value;
  }

  startNum *= 1;
  endNum *= 1;

  if (startNum == 0) {
    selectionNumber = endNum;
  } else if (endNum == 0) {
    selectionNumber = startNum;
  } else {
    selectionNumber = (startNum < endNum) ? startNum : endNum;
  }

  result.text = selectionText.toString();
  result.lineNum = selectionNumber;
  result.startPos = startPos;
  result.len = result.text.length;

  storedSelectionLeft = result;
}

let storedSelectionRight = new Object();
storedSelectionRight.len = 0;

function storeSelectionRight() {
  let result = new Object();
  let selectionText = "";
  let startNum = "";
  let endNum = "";
  let selectionNumber = "";
  let startPos = 0;

  if (document.getSelection) {
    selectionText = document.getSelection();
    startPos = selectionText.getRangeAt(0).startOffset;
  } else if (document.selection) {
    selectionText = document.selection.createRange().text;
  }

  if (document.getSelection().anchorNode.parentElement.attributes.length == 2 && !(document.getSelection().anchorNode.parentElement.attributes[1].value.includes('#'))) {
    startNum = document.getSelection().anchorNode.parentElement.attributes[1].value;
  } else if (document.getSelection().anchorNode.parentElement.firstChild.parentNode.offsetParent.attributes.length == 2 && !(document.getSelection().anchorNode.parentElement.firstChild.parentNode.offsetParent.attributes[1].value.includes('#'))) {
    startNum = document.getSelection().anchorNode.parentElement.firstChild.parentNode.offsetParent.attributes[1].value;
  }

  if (document.getSelection().focusNode.parentElement.attributes.length == 2 && !(document.getSelection().focusNode.parentElement.attributes[1].value.includes('#'))) {
    endNum = document.getSelection().focusNode.parentElement.attributes[1].value;
  } else if (document.getSelection().focusNode.parentElement.firstChild.parentNode.offsetParent.attributes.length == 2 && !(document.getSelection().focusNode.parentElement.firstChild.parentNode.offsetParent.attributes[1].value.includes('#'))) {
    endNum = document.getSelection().focusNode.parentElement.firstChild.parentNode.offsetParent.attributes[1].value;
  }

  startNum *= 1;
  endNum *= 1;

  if (startNum == 0) {
    selectionNumber = endNum;
  } else if (endNum == 0) {
    selectionNumber = startNum;
  } else {
    selectionNumber = (startNum < endNum) ? startNum : endNum;
  }

  result.text = selectionText.toString();
  result.lineNum = selectionNumber;
  result.startPos = startPos;
  result.len = result.text.length;

  storedSelectionRight = result;
}

let tmpStartPos = 0;
let tmpLen = 0;

let hintCnt = 0;






function GenUpdateLeft() {
  let selectResult = getSelectResult();
  if (getSelectResult().len == 0) {
      alert("Please select texts on the left side.");
      return;
  } else if (storedSelectionRight.len == 0) {
      alert("Please select texts on the right side.");
      return;
  }
  if (selectResult.text.indexOf('BlockServiceHandler', 0) < 0 || selectResult.len > 21) {
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
  
  if (storedSelectionRight.text.indexOf('BlockWorkerClientServiceHandler', 0) < 0 || storedSelectionRight.len > 33) {
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
  selectResult = getSelectResult();
  newRow.id = storedSelectionRight.len + "/" + selectResult.len;

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
  let selectResult = getSelectResult();
  if (getSelectResult().len == 0) {
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
  selectResult = getSelectResult();
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



let selectResult = new Object();

// Context Menu 생성
function handleCreateContextMenu_left(event){
  // 기본 Context Menu가 나오지 않게 차단
  event.preventDefault();
  
  // Context Menu Element 생성
  const ctxMenuId = 'dochi_context_menu';
  const ctxMenu = document.createElement('div');
  
  // Context Menu Element 옵션 설정
  ctxMenu.id = ctxMenuId;
  ctxMenu.className = 'custom-context-menu';
  
  // 위치 설정
  ctxMenu.style.top = event.pageY+'px';
  ctxMenu.style.left = event.pageX+'px';
  
  dragSelect();

  // 메뉴 목록 생성
  ctxMenu.appendChild(renderContextMenuList([
    {
      label: "Generate Delete",
      onClick: function(){
        GenController(3, 0);
      }
    },
    {
      label: "Generate Move",
      onClick: function(event){
        GenController(3, 2);
      }
    },
    {
      label: "Generate Update",
      onClick: function(event){
        GenController(3, 3, 1);
      }
    }
  ]));
  
  // 이전 Element 삭제
  const prevCtxMenu = document.getElementById( ctxMenuId );
  if( prevCtxMenu ){
    prevCtxMenu.remove();
  }
  
  // Body에 Context Menu를 추가.
  document.body.appendChild( ctxMenu );
}
function handleCreateContextMenu_right(event){
  // 기본 Context Menu가 나오지 않게 차단
  event.preventDefault();
  
  // Context Menu Element 생성
  const ctxMenuId = 'dochi_context_menu';
  const ctxMenu = document.createElement('div');
  
  // Context Menu Element 옵션 설정
  ctxMenu.id = ctxMenuId;
  ctxMenu.className = 'custom-context-menu';
  
  // 위치 설정
  ctxMenu.style.top = event.pageY+'px';
  ctxMenu.style.left = event.pageX+'px';
  
  dragSelect();

  // 메뉴 목록 생성
  ctxMenu.appendChild(renderContextMenuList([
      {
      label: "Generate Insert",
        onClick: function(event){
          GenController(3, 1);
        }
      },
      {
      label: "Generate Move",
        onClick: function(event){
          GenController(3, 2);
        }
      },
      {
      label: "Generate Update",
        onClick: function(event){
          GenController(3, 3);
        }
      }
  ]));
  
  // 이전 Element 삭제
  const prevCtxMenu = document.getElementById( ctxMenuId );
  if( prevCtxMenu ){
    prevCtxMenu.remove();
  }
  
  // Body에 Context Menu를 추가.
  document.body.appendChild( ctxMenu );
}

function getSelectResult() {
  return selectResult;
}


function dragSelect() {
  let result = new Object();
  let selectionText = "";
  let startNum = "";
  let endNum = "";
  let selectionNumber = "";
  let startPos = 0;

  if (document.getSelection) {
    selectionText = document.getSelection();
    try {
      startPos = selectionText.getRangeAt(0).startOffset;
    }
    catch {
      alert('Pleas select texts again.');
      return;
    }
  } else if (document.selection) {
    selectionText = document.selection.createRange().text;
  }
  
  if (document.getSelection().anchorNode.parentElement.attributes.length == 2 && !(document.getSelection().anchorNode.parentElement.attributes[1].value.includes('#'))) {
    startNum = document.getSelection().anchorNode.parentElement.attributes[1].value;
  } else if (document.getSelection().anchorNode.parentElement.firstChild.parentNode.offsetParent.attributes.length == 2 && !(document.getSelection().anchorNode.parentElement.firstChild.parentNode.offsetParent.attributes[1].value.includes('#'))) {
    startNum = document.getSelection().anchorNode.parentElement.firstChild.parentNode.offsetParent.attributes[1].value;
  }

  if (document.getSelection().focusNode.parentElement.attributes.length == 2 && !(document.getSelection().focusNode.parentElement.attributes[1].value.includes('#'))) {
    endNum = document.getSelection().focusNode.parentElement.attributes[1].value;
  } else if (document.getSelection().focusNode.parentElement.firstChild.parentNode.offsetParent.attributes.length == 2 && !(document.getSelection().focusNode.parentElement.firstChild.parentNode.offsetParent.attributes[1].value.includes('#'))) {
    endNum = document.getSelection().focusNode.parentElement.firstChild.parentNode.offsetParent.attributes[1].value;
  }

  startNum *= 1;
  endNum *= 1;

  if (startNum == 0) {
    selectionNumber = endNum;
  } else if (endNum == 0) {
    selectionNumber = startNum;
  } else {
    selectionNumber = (startNum < endNum) ? startNum : endNum;
  }

  result.text = selectionText.toString();
  result.lineNum = selectionNumber;
  result.startPos = startPos;
  result.len = result.text.length;

  selectResult = result;
}




function move_inner() {
  let left = document.getElementById("left");
  let right = document.getElementById("right")

  left.scrollTo(0, 330);
  right.scrollTo(0, 330);
}



function init() {
    document.getElementById('left').onmouseup = storeSelectionLeft;
    document.getElementById('right').onmouseup = storeSelectionRight;
    document.getElementById('left').addEventListener('contextmenu', handleCreateContextMenu_left, false);
    document.getElementById('right').addEventListener('contextmenu', handleCreateContextMenu_right, false);
    document.addEventListener('click', handleClearContextMenu, false);
    
    setStandardHeight();
}