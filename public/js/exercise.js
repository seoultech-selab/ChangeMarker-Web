async function tutorialCheckAjax(lhs, rhs) {
  $.ajax({
      type: 'post',
      url: '/tutorialCheck',
      data: {lhs : lhs, rhs : rhs},
      dataType: 'json',
      success: function(res) {
        let checkButton = document.getElementById('checkButton');

        if (res.diffCnt == 0) {
          checkButton.value = "Go Next!";
          checkButton.style.backgroundColor = "#0dff47";
          checkButton.onclick = "";
          checkButton.type = "submit";

          let parentWindow = window.parent.document;
          let checkExercise = parentWindow.getElementById('checkExercise');
          let currentPageNum = Number(parentWindow.getElementById('current_page').innerText);
          checkExercise.value = String(currentPageNum);
        }
        else {
          checkButton.style.backgroundColor = "#fd6a78";
          popup = window.open("tutorialPopup.html", "childForm", "width=800, height=300");
          setTimeout(() => {
            let lhsCodeTag = document.createElement('code');
            lhsCodeTag.innerHTML = res.lhsTemplate;
            lhsCodeTag.className = "java";
            let rhsCodeTag = document.createElement('code');
            rhsCodeTag.innerHTML = res.rhsTemplate;
            rhsCodeTag.className = "java";
  
            let lhsPreTag = popup.document.getElementById('inner_left');
            lhsPreTag.appendChild(lhsCodeTag);
            let rhsPreTag = popup.document.getElementById('inner_right');
            rhsPreTag.appendChild(rhsCodeTag);
          },500);

        }
      }
  });
}

const TYPE_NAMES = ["Delete", "Insert", "Move", "Update"];
async function GenController(type, typeCheck) {
    if (type.includes(typeCheck)) {
        if (typeCheck == 0) {
          GenDelete();
        }
        else if (typeCheck == 1) {
          GenInsert();
        }
        else if (typeCheck == 2) {
          GenMoveLeft();
        }
        else if (typeCheck == 3) {
          GenMoveRight();
        }
        else if (typeCheck == 4) {
          GenUpdateLeft();
        }
        else {
          GenUpdateRight();
        }
    }
    else {
        alert('This example has a only "' + TYPE_NAMES[type] + '" script!');
    }

}

async function deleteRow(element, e) {
    let table = document.getElementById("edit_scripts");
    let target = element.parentNode.parentNode;
    let rowNum = target.rowIndex;

    table.deleteRow(rowNum);
}

// Context Menu List 렌더링
function renderContextMenuList( list ){
  // List Element 생성
  const ctxMenuList = document.createElement('ul');
  
  // List Item 생성
  list.forEach(function( item ){
    // Item Element 생성
    const ctxMenuItem = document.createElement('li');
    const ctxMenuItem_a = document.createElement('a');
    const ctxMenuItem_a_text = document.createTextNode(item.label);
    
    // 클릭 이벤트 설정
    if( item.onClick ){
      ctxMenuItem.addEventListener( 'click', item.onClick, false );
    }

    // Item 추가
    ctxMenuItem_a.appendChild( ctxMenuItem_a_text );
    ctxMenuItem.appendChild( ctxMenuItem_a );
    ctxMenuList.appendChild( ctxMenuItem );
  });
  
  // List Element 반환
  return ctxMenuList;
}

// Context Menu 제거
function handleClearContextMenu(event){
  const ctxMenu = document.getElementById('dochi_context_menu');
  if( ctxMenu ){
    ctxMenu.remove();
  }
}

function createDeleteButton(delType) {
  let newATag = document.createElement('a');
  newATag.href = "javascript:void(0)";
  newATag.text = "Delete";
  newATag.className = "del_btn";
  newATag.onclick = function () { deleteRow(this, delType); };
  return newATag;
}






function leftHighlightSelection() {
  let selectedSpans = document.getElementById("left").getElementsByClassName("selection");
  for (i in selectedSpans) {
    selectedSpans[i].style = "";
  }

  let selected = document.getSelection();
  if(selected.toString().length > 0) {
    highlightSelection(selected);
  }
}

function rightHighlightSelection() {
  let selectedSpans = document.getElementById("right").getElementsByClassName("selection");
  for (i in selectedSpans) {
    selectedSpans[i].style = "";
  }
  
  let selected = document.getSelection();
  if(selected.toString().length > 0) {
    highlightSelection(selected);
  }
}


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

  leftHighlightSelection();
}

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

  rightHighlightSelection();
}

function highlightSelection(selected) {
  let startNum, endNum, selectionStartNumber, selectionEndNumber;
  if (selected.anchorNode.parentElement.attributes.length == 2 && !(selected.anchorNode.parentElement.attributes[1].value.includes('#'))) {
    startNum = selected.anchorNode.parentElement.attributes[1].value;
  } else if (selected.anchorNode.parentElement.firstChild.parentNode.offsetParent.attributes.length == 2 && !(selected.anchorNode.parentElement.firstChild.parentNode.offsetParent.attributes[1].value.includes('#'))) {
    startNum = selected.anchorNode.parentElement.firstChild.parentNode.offsetParent.attributes[1].value;
  }

  if (selected.focusNode.parentElement.attributes.length == 2 && !(selected.focusNode.parentElement.attributes[1].value.includes('#'))) {
    endNum = selected.focusNode.parentElement.attributes[1].value;
  } else if (selected.focusNode.parentElement.firstChild.parentNode.offsetParent.attributes.length == 2 && !(selected.focusNode.parentElement.firstChild.parentNode.offsetParent.attributes[1].value.includes('#'))) {
    endNum = selected.focusNode.parentElement.firstChild.parentNode.offsetParent.attributes[1].value;
  }

  startNum *= 1;
  endNum *= 1;

  if (startNum == 0) {
    selectionStartNumber = endNum;
    selectionEndNumber = startNum;
  } else if (endNum == 0) {
    selectionStartNumber = startNum;
    selectionEndNumber = endNum;
  } else {
    selectionStartNumber = (startNum < endNum) ? startNum : endNum;
    selectionEndNumber = (startNum > endNum) ? startNum : endNum;
  }
  
  storedSelectLines = [];
  storedSelectStartPos = selectionStartNumber - 1;


  selected = selected.getRangeAt(0);
  let old = selected.cloneContents();

  if (selectionStartNumber != selectionEndNumber) {
    let safeRanges = getSafeRanges(selected);
    for (let i = 0; i < safeRanges.length; i++) {
      highlightRange(safeRanges[i]);
    }
    let tbody = document.getElementById('left').children[0].children[0].children[0].children[0];
    let oldChildren = old.children;
  
    for (let i = 1; i < oldChildren.length - 1; i++) {
      storedSelectLines.push(tbody.children[selectionStartNumber + i - 1].children[1].innerHTML);
      let span = createHilightedSpan(oldChildren[i].children[1].innerHTML);
      tbody.children[selectionStartNumber + i - 1].children[1].innerHTML = span.innerHTML;
    }
    
    storedSelectLines.push(tbody.children[selectionEndNumber - 1].children[1].innerHTML);
  }
  else {
    let safeRanges = getSafeRanges(selected);
    for (let i = 0; i < safeRanges.length; i++) {
      highlightRange(safeRanges[i]);
    }
  }
}

function getSafeRanges(dangerous) {
  let a = dangerous.commonAncestorContainer;
  // Starts -- Work inward from the start, selecting the largest safe range
  let s = new Array(0), rs = new Array(0);
  if (dangerous.startContainer != a)
    for(let i = dangerous.startContainer; i != a; i = i.parentNode) {
      s.push(i);
    }
  
  if (0 < s.length) for(let i = 0; i < s.length; i++) {
    let xs = document.createRange();
    if (i) {
        xs.setStartAfter(s[i-1]);
        xs.setEndAfter(s[i].lastChild);
    }
    else {
        xs.setStart(s[i], dangerous.startOffset);
        xs.setEndAfter(
            (s[i].nodeType == Node.TEXT_NODE)
            ? s[i] : s[i].lastChild
        );
    }
    if (xs.commonAncestorContainer.innerHTML.indexOf("data-line-number") < 0) {
      rs.push(xs);
    }
  }

  // Ends -- basically the same code reversed
  let e = new Array(0), re = new Array(0);
  if (dangerous.endContainer != a)
    for(let i = dangerous.endContainer; i != a; i = i.parentNode)
        e.push(i)
  ;
  if (0 < e.length) for(let i = 0; i < e.length; i++) {
    let xe = document.createRange();
    if (i) {
        xe.setStartBefore(e[i].firstChild);
        xe.setEndBefore(e[i-1]);
    }
    else {
        xe.setStartBefore(
            (e[i].nodeType == Node.TEXT_NODE)
            ? e[i] : e[i].firstChild
        );
        xe.setEnd(e[i], dangerous.endOffset);
    }
    if (xe.commonAncestorContainer.innerHTML.indexOf("data-line-number") < 0) {
      re.unshift(xe);
    }
  }
  
  if ((0 >= s.length) || (0 >= e.length)) {
    return [dangerous];
  }

  response = rs.concat(re);
  
  return response;
}

function createHilightedSpan(text) {
  let span = document.createElement('span');
  span.className = "selection";
  span.style.backgroundColor = '#bbd6fb';
  span.innerHTML = text;
  let div = document.createElement('div');
  div.appendChild(span);
  return div;
}

function highlightRange(range) {
  let newNode = document.createElement("span");
  newNode.setAttribute(
     "style",
     "background-color: #bbd6fb;"
  );
  newNode.className = "selection";
  range.surroundContents(newNode);
}

function move_inner(leftX, leftY, rightX, rightY) {
  let left = document.getElementById("left");
  let right = document.getElementById("right")

  left.scrollTo(leftX, leftY);
  right.scrollTo(rightX, rightY);
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

function handleCreateContextMenu_left(event){
  event.preventDefault();
  
  const ctxMenuId = 'dochi_context_menu';
  const ctxMenu = document.createElement('div');
  
  ctxMenu.id = ctxMenuId;
  ctxMenu.className = 'custom-context-menu';
  
  ctxMenu.style.top = event.pageY+'px';
  ctxMenu.style.left = event.pageX+'px';
  
  dragSelect();

  ctxMenu.appendChild(renderContextMenuList([
    {
      label: "Generate Delete",
      onClick: function(){
        GenController(genControllerType, 0);
      }
    },
    {
      label: "Generate Move",
      onClick: function(event){
        GenController(genControllerType, 2);
      }
    },
    {
      label: "Generate Update",
      onClick: function(event){
        GenController(genControllerType, 4);
      }
    }
  ]));
  
  const prevCtxMenu = document.getElementById( ctxMenuId );
  if( prevCtxMenu ){
    prevCtxMenu.remove();
  }

  document.body.appendChild( ctxMenu );
}

function handleCreateContextMenu_right(event){
  event.preventDefault();
  
  const ctxMenuId = 'dochi_context_menu';
  const ctxMenu = document.createElement('div');
  
  ctxMenu.id = ctxMenuId;
  ctxMenu.className = 'custom-context-menu';
  
  ctxMenu.style.top = event.pageY+'px';
  ctxMenu.style.left = event.pageX+'px';
  
  dragSelect();

  ctxMenu.appendChild(renderContextMenuList([
      {
      label: "Generate Insert",
        onClick: function(event){
          GenController(genControllerType, 1);
        }
      },
      {
      label: "Generate Move",
        onClick: function(event){
          GenController(genControllerType, 3);
        }
      },
      {
      label: "Generate Update",
        onClick: function(event){
          GenController(genControllerType, 5);
        }
      }
  ]));
  
  const prevCtxMenu = document.getElementById( ctxMenuId );
  if( prevCtxMenu ){
    prevCtxMenu.remove();
  }
  
  document.body.appendChild( ctxMenu );
}

function init() {
  document.getElementById('left').onmouseup = storeSelectionLeft;
  document.getElementById('right').onmouseup = storeSelectionRight;
  document.getElementById('left').addEventListener('contextmenu', handleCreateContextMenu_left, false);
  document.getElementById('right').addEventListener('contextmenu', handleCreateContextMenu_right, false);
  document.addEventListener('click', handleClearContextMenu, false);
}