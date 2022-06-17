<<<<<<< HEAD
let storedSelectionLeft = new Object();
storedSelectionLeft.len = 0;

let storedSelectionRight = new Object();
storedSelectionRight.len = 0;

=======
>>>>>>> e0f68f9f27b29449ae41736396ee60b7fe72edf2
let tmpStartPos = 0;
let tmpLen = 0;

let hintCnt = 0;

<<<<<<< HEAD
let selectResult = new Object();

let storedSelectStartPos = 0;
let storedSelectLines = new Array();

let genControllerType = [1];
=======
>>>>>>> e0f68f9f27b29449ae41736396ee60b7fe72edf2

function GenInsert() {
  let selectResult = getSelectResult();
  if (getSelectResult().len == 0) {
      alert("Please select texts.");
      return;
  }

  if (selectResult.text.indexOf('this.routing = routing;', 0) < 0) {
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
<<<<<<< HEAD
=======
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
        GenController(1, 0);
      }
    },
    {
      label: "Generate Move",
      onClick: function(event){
        GenController(1, 2);
      }
    },
    {
      label: "Generate Update",
      onClick: function(event){
        GenController(1, 3);
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
          GenController(1, 1);
        }
      },
      {
      label: "Generate Move",
        onClick: function(event){
          GenController(1, 2);
        }
      },
      {
      label: "Generate Update",
        onClick: function(event){
          GenController(1, 3);
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

  left.scrollTo(0, 430);
  right.scrollTo(0, 430);
}


let storedSelectStartPos = 0;
let storedSelectLines = new Array();

function init() {
    document.getElementById('left').onmouseup = leftHighlightSelection;
    document.getElementById('right').onmouseup = rightHighlightSelection;
    document.getElementById('left').addEventListener('contextmenu', handleCreateContextMenu_left, false);
    document.getElementById('right').addEventListener('contextmenu', handleCreateContextMenu_right, false);
    document.addEventListener('click', handleClearContextMenu, false);
>>>>>>> e0f68f9f27b29449ae41736396ee60b7fe72edf2
}