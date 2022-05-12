async function tutorialCheckAjax(lhs, rhs) {
  $.ajax({
      type: 'post',
      url: '/tutorialCheck',
      data: {lhs : lhs, rhs : rhs},
      dataType: 'json',
      success: function(res) {
        var checkButton = document.getElementById('checkButton');

        if (res.diffCnt == 0) {
          checkButton.value = "Go Next!";
          checkButton.style.backgroundColor = "#0dff47";
          checkButton.onclick = "";
          checkButton.type = "submit";

          var parentWindow = window.parent.document;
          var checkExercise = parentWindow.getElementById('checkExercise');
          var currentPageNum = Number(parentWindow.getElementById('current_page').innerText);
          checkExercise.value = String(currentPageNum);
        }
        else {
          checkButton.style.backgroundColor = "#fd6a78";
          popup = window.open("tutorialPopup.html", "childForm", "width=800, height=300");
          setTimeout(() => {
            var lhsCodeTag = document.createElement('code');
            lhsCodeTag.innerHTML = res.lhsTemplate;
            lhsCodeTag.className = "java";
            var rhsCodeTag = document.createElement('code');
            rhsCodeTag.innerHTML = res.rhsTemplate;
            rhsCodeTag.className = "java";
  
            var lhsPreTag = popup.document.getElementById('inner_left');
            lhsPreTag.appendChild(lhsCodeTag);
            var rhsPreTag = popup.document.getElementById('inner_right');
            rhsPreTag.appendChild(rhsCodeTag);
          },500);

        }
      }
  });
}

var check = 0;
var tmpStartPos = 0;
var tmpLen = 0;
async function GenController(e) {
    if (e == 1 && check == 0) {
        GenDelete();
    } else if (e == 2 && check == 0) {
        alert('This example has a only "Delete" script!');
    } else if (e == 3 && (check == 0 || check == 1)) {
        alert('This example has a only "Delete" script!');
    } else if (e == 4 && (check == 0 || check == 2)) {
      alert('This example has a only "Delete" script!');
    } else if (e == 5 && (check == 0 || check == 3)) {
      alert('This example has a only "Delete" script!');
    } else if (e == 6 && (check == 0 || check == 4)) {
      alert('This example has a only "Delete" script!');
    } else if (check == 1) {
      alert('This example has a only "Delete" script!');
    } else if (check == 2) {
      alert('This example has a only "Delete" script!');
    } else if (check == 3) {
      alert('This example has a only "Delete" script!');
    } else if (check == 4) {
      alert('This example has a only "Delete" script!');
    }
}

var hintCnt = 0;

function GenDelete() {
  var selectResult = getSelectResult();
    if (selectResult.len == 0) {
        alert("Please select texts.");
        return;
    }

    var checkExercise = window.parent.document.getElementById('checkExercise');
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

    var table = document.getElementById("edit_scripts");
    var newRow = table.insertRow();
    newRow.id = selectResult.len + "/:" + selectResult.startPos + "/";

    var newATag = document.createElement('a');
    newATag.href = "javascript:void(0)";
    newATag.text = "Delete";
    newATag.className = "del_btn";
    newATag.onclick = function() {deleteRow(this, 0);};


    var newCell1 = newRow.insertCell(0);
    var newCell2 = newRow.insertCell(1);
    var newCell3 = newRow.insertCell(2);
    var newCell4 = newRow.insertCell(3);
    var newCell5 = newRow.insertCell(4);
    var newCell6 = newRow.insertCell(5);

    newCell1.innerText = 'Delete';
    var preTag = document.createElement('pre');
    preTag.innerHTML = selectResult.text;
    newCell2.appendChild(preTag);
    newCell3.innerText = selectResult.lineNum;
    newCell6.appendChild(newATag);

    var currentPageNum = Number(window.parent.document.getElementById('current_page').innerText);
    checkExercise.value = currentPageNum;
    var nextButton = window.parent.document.getElementById('next_button');
    nextButton.style.color = "#393E46";
    nextButton.disabled = false;
}

async function deleteRow(element, e) {
    var table = document.getElementById("edit_scripts");
    var trs = table.children[0].children;
    var lastRow = trs[trs.length - 1];
    var target = element.parentNode.parentNode;
    var rowNum = target.rowIndex;

    if (e == 1 && lastRow == target) {
        check = 0;
    }
    table.deleteRow(rowNum);
}









var selectResult = new Object();

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
        GenController(1);
      }
    },
    {
      label: "Generate Move",
      onClick: function(event){
        GenController(3);
      }
    },
    {
      label: "Generate Update",
      onClick: function(event){
        GenController(5);
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
          GenController(2);
        }
      },
      {
      label: "Generate Move",
        onClick: function(event){
          GenController(4);
        }
      },
      {
      label: "Generate Update",
        onClick: function(event){
          GenController(6);
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

// Context Menu 제거
function handleClearContextMenu(event){
  const ctxMenu = document.getElementById('dochi_context_menu');
  if( ctxMenu ){
    ctxMenu.remove();
  }
}

function getSelectResult() {
  return selectResult;
}


function dragSelect() {
  var result = new Object();
  var selectionText = "";
  var startNum = "";
  var endNum = "";
  var selectionNumber = "";
  var startPos = 0;

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
  var left = document.getElementById("left");
  var right = document.getElementById("right")

  left.scrollTo(0, 130);
  right.scrollTo(0, 130);
}



function init() {
    document.getElementById('left').addEventListener('contextmenu', handleCreateContextMenu_left, false);
    document.getElementById('right').addEventListener('contextmenu', handleCreateContextMenu_right, false);
    document.addEventListener('click', handleClearContextMenu, false);
}