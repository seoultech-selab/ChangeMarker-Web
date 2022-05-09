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
          var currentPageNum = Number(parentWindow.getElementById('total_page').innerText);
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
        GenInsert();
    } else if (e == 3 && (check == 0 || check == 1)) {
        GenMoveLeft();
    } else if (e == 4 && (check == 0 || check == 2)) {
        GenMoveRight();
    } else if (e == 5 && (check == 0 || check == 3)) {
        GenUpdateLeft();
    } else if (e == 6 && (check == 0 || check == 4)) {
        GenUpdateRight();
    } else if (check == 1) {
        alert("Please generate Move on left side code.");
    } else if (check == 2) {
        alert("Please generate Move on right side code.");
    } else if (check == 3) {
        alert("Please generate Update on left side code.");
    } else if (check == 4) {
        alert("Please generate Update on right side code.");
    }
}

function GenDelete() {
    if (getSelectResult().len == 0) {
        alert("Please select texts.");
        return;
    }
    var table = document.getElementById("edit_scripts");
    var newRow = table.insertRow();
    var selectResult = getSelectResult();
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
}

function GenInsert() {
    if (getSelectResult().len == 0) {
        alert("Please select texts.");
        return;
    }
    var table = document.getElementById("edit_scripts");
    var newRow = table.insertRow();
    var selectResult = getSelectResult();
    newRow.id = "/" + selectResult.len + ":/" + selectResult.startPos;

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

    newCell1.innerText = 'Insert';
    var preTag = document.createElement('pre');
    preTag.innerHTML = selectResult.text;
    newCell4.appendChild(preTag);
    newCell5.innerText = selectResult.lineNum;
    newCell6.appendChild(newATag);
}

function GenMoveLeft() {
    if (getSelectResult().len == 0) {
        alert("Please select texts.");
        return;
    }
    if (check == 0) {
        var table = document.getElementById("edit_scripts");
        var newRow = table.insertRow();
        var selectResult = getSelectResult();
        newRow.id = selectResult.len + "/:" + selectResult.startPos + "/";

        var newATag = document.createElement('a');
        newATag.href = "javascript:void(0)";
        newATag.text = "Delete";
        newATag.className = "del_btn";
        newATag.onclick = function() {deleteRow(this, 1);};


        var newCell1 = newRow.insertCell(0);
        var newCell2 = newRow.insertCell(1);
        var newCell3 = newRow.insertCell(2);
        var newCell4 = newRow.insertCell(3);
        var newCell5 = newRow.insertCell(4);
        var newCell6 = newRow.insertCell(5);

        newCell1.innerText = 'Move';
        var preTag = document.createElement('pre');
        preTag.innerHTML = selectResult.text;
        newCell2.appendChild(preTag);
        newCell3.innerText = selectResult.lineNum;
        newCell6.appendChild(newATag);
        tmpStartPos = selectResult.startPos;
        tmpLen = selectResult.len;
        check = 2;
    } else if (check == 1) {
        var selectResult = getSelectResult();
        var table = document.getElementById("edit_scripts");
        var trs = table.children[0].children;
        var tr = trs[trs.length - 1];
        var tds = tr.children;

        var trIds = tr.id.split(":");
        tr.id = selectResult.len + trIds[0] + ":" + selectResult.startPos + trIds[1];
      
        var preTag = document.createElement('pre');
        preTag.innerHTML = selectResult.text;
        tds[1].appendChild(preTag);
        tds[2].innerText = selectResult.lineNum;
        check = 0;
    }
}

function GenMoveRight() {
    if (getSelectResult().len == 0) {
        alert("Please select texts.");
        return;
    }
    if (check == 0) {
        var table = document.getElementById("edit_scripts");
        var newRow = table.insertRow();
        var selectResult = getSelectResult();
        newRow.id = "/" + selectResult.len + ":/" + selectResult.startPos;

        var newATag = document.createElement('a');
        newATag.href = "javascript:void(0)";
        newATag.text = "Delete";
        newATag.className = "del_btn";
        newATag.onclick = function() {deleteRow(this, 1);};


        var newCell1 = newRow.insertCell(0);
        var newCell2 = newRow.insertCell(1);
        var newCell3 = newRow.insertCell(2);
        var newCell4 = newRow.insertCell(3);
        var newCell5 = newRow.insertCell(4);
        var newCell6 = newRow.insertCell(5);

        newCell1.innerText = 'Move';
        var preTag = document.createElement('pre');
        preTag.innerHTML = selectResult.text;
        newCell4.appendChild(preTag);
        newCell5.innerText = selectResult.lineNum;
        newCell6.appendChild(newATag);
        tmpStartPos = selectResult.startPos;
        tmpLen = selectResult.len;
        check = 1;
    } else if (check == 2) {
        var selectResult = getSelectResult();
        var table = document.getElementById("edit_scripts");
        var trs = table.children[0].children;
        var tr = trs[trs.length - 1];
        var tds = tr.children;
        
        var trIds = tr.id.split(":");
        tr.id = trIds[0] + selectResult.len + ":" + trIds[1] + selectResult.startPos;

        var preTag = document.createElement('pre');
        preTag.innerHTML = selectResult.text;
        tds[3].appendChild(preTag);
        tds[4].innerText = selectResult.lineNum;
        check = 0;
    }
}

function GenUpdateLeft() {
    if (getSelectResult().len == 0) {
        alert("Please select texts.");
        return;
    }
    if (check == 0) {
        var table = document.getElementById("edit_scripts");
        var newRow = table.insertRow();
        var selectResult = getSelectResult();
        newRow.id = selectResult.len +  "/:" + selectResult.startPos + "/";

        var newATag = document.createElement('a');
        newATag.href = "javascript:void(0)";
        newATag.text = "Delete";
        newATag.className = "del_btn";
        newATag.onclick = function() {deleteRow(this, 1);};


        var newCell1 = newRow.insertCell(0);
        var newCell2 = newRow.insertCell(1);
        var newCell3 = newRow.insertCell(2);
        var newCell4 = newRow.insertCell(3);
        var newCell5 = newRow.insertCell(4);
        var newCell6 = newRow.insertCell(5);

        newCell1.innerText = 'Update';
        var preTag = document.createElement('pre');
        preTag.innerHTML = selectResult.text;
        newCell2.appendChild(preTag);
        newCell3.innerText = selectResult.lineNum;
        newCell6.appendChild(newATag);
        tmpStartPos = selectResult.startPos;
        tmpLen = selectResult.len;
        check = 4;
    } else if (check == 3) {
        var selectResult = getSelectResult();
        var table = document.getElementById("edit_scripts");
        var trs = table.children[0].children;
        var tr = trs[trs.length - 1];
        var tds = tr.children;

        var trIds = tr.id.split(":");
        tr.id = selectResult.len + trIds[0] + ":" + selectResult.startPos + trIds[1];

        var preTag = document.createElement('pre');
        preTag.innerHTML = selectResult.text;
        tds[1].appendChild(preTag);
        tds[2].innerText = selectResult.lineNum;
        check = 0;
    }
}

function GenUpdateRight() {
    if (getSelectResult().len == 0) {
        alert("Please select texts.");
        return;
    }
    if (check == 0) {
        var table = document.getElementById("edit_scripts");
        var newRow = table.insertRow();
        var selectResult = getSelectResult();
        newRow.id =  "/" + selectResult.len + ":/" + selectResult.startPos;

        var newATag = document.createElement('a');
        newATag.href = "javascript:void(0)";
        newATag.text = "Delete";
        newATag.className = "del_btn";
        newATag.onclick = function() {deleteRow(this, 1);};


        var newCell1 = newRow.insertCell(0);
        var newCell2 = newRow.insertCell(1);
        var newCell3 = newRow.insertCell(2);
        var newCell4 = newRow.insertCell(3);
        var newCell5 = newRow.insertCell(4);
        var newCell6 = newRow.insertCell(5);

        newCell1.innerText = 'Update';
        var preTag = document.createElement('pre');
        preTag.innerHTML = selectResult.text;
        newCell4.appendChild(preTag);
        newCell5.innerText = selectResult.lineNum;
        newCell6.appendChild(newATag);
        tmpStartPos = selectResult.startPos;
        tmpLen = selectResult.len;
        check = 3;
    } else if (check == 4) {
        var selectResult = getSelectResult();
        var table = document.getElementById("edit_scripts");
        var trs = table.children[0].children;
        var tr = trs[trs.length - 1];
        var tds = tr.children;

        var trIds = tr.id.split(":");
        tr.id = trIds[0] + selectResult.len + ":" + trIds[1] + selectResult.startPos;

        var preTag = document.createElement('pre');
        preTag.innerHTML = selectResult.text;
        tds[3].appendChild(preTag);
        tds[4].innerText = selectResult.lineNum;
        check = 0;
    }
}

async function deleteRow(element, e) {
    var table = document.getElementById("edit_scripts");
    var trs = table.children[0].children;
    var lastRow = trs[trs.length - 1];
    var target = element.parentNode.parentNode;
    var rowNum = target.rowIndex;

    var tds = trs[rowNum].children;

    var lens = target.id.split('/');

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






async function checkExam() {
  var lhs = `import java.util.Map;

  private BlockServiceHandler mWorkerServiceHandler = null;
  `;
  lhs = lhs.split('\n');

  var rhs = `import java.util.Map;

  private BlockWorkerClientServiceHandler mWorkerServiceHandler = null;
  `;
  rhs = rhs.split('\n');

  var trs = document.getElementById('edit_scripts').children[0].children;
  var trsLength = trs.length;

  var lhsSortedTrs = new Array();
  var rhsSortedTrs = new Array();
  for (var i = 1; i < trsLength; i++) {
    var trIds = trs[i].id.split(':');
    var codeLengths = trIds[0].split('/').map(x => Number(x));
    var startPoses = trIds[1].split('/').map(x => Number(x));

    var tds = trs[i].children;

    if (codeLengths[0] != 0) {
      var tr = new Object();
      tr.lhsLength = codeLengths[0];
      tr.lhsStartPos = startPoses[0];
      tr.old_code = tds[1].innerHTML != '' ? tds[1].children[0].innerHTML : '';
      tr.line_number_old = tds[2].innerHTML != '' ? Number(tds[2].innerHTML) : 0;
      lhsSortedTrs.push(tr);
    }

    if (codeLengths[1] != 0) {
      var tr = new Object();
      tr.rhsLength = codeLengths[1];
      tr.rhsStartPos = startPoses[1];
      tr.new_code = tds[3].innerHTML != '' ? tds[3].children[0].innerHTML : '';
      tr.line_number_new = tds[4].child != '' ? Number(tds[4].innerHTML) : 0;
      rhsSortedTrs.push(tr);
    }
  }

  lhsSortedTrs.sort((a, b) => {
    if (a.line_number_old > b.line_number_old) {
      return 1;
    }
    if (a.line_number_old < b.line_number_old) {
      return -1;
    }
    return 0;
  })

  rhsSortedTrs.sort((a, b) => {
    if (a.line_number_new > b.line_number_new) {
      return 1;
    }
    if (a.line_number_new < b.line_number_new) {
      return -1;
    }
    return 0;
  })

  for (var i = 0; i < lhsSortedTrs.length; i++) {
    var lhsTrs = lhsSortedTrs[i]
    var codeLines = lhsTrs.old_code.split('\n')
    for (var j = 0; j < codeLines.length; j++) {
      while (lhsTrs.lhsStartPos < lhs[lhsTrs.line_number_old - 1].length) {
        if (lhs[lhsTrs.line_number_old - 1].substring(lhsTrs.lhsStartPos, lhsTrs.lhsStartPos + codeLines[j].length) == codeLines[j]) {
          lhs[lhsTrs.line_number_old - 1] = lhs[lhsTrs.line_number_old - 1].substring(0, lhsTrs.lhsStartPos) + lhs[lhsTrs.line_number_old - 1].substring(lhsTrs.lhsStartPos + codeLines[j].length, lhs[lhsTrs.line_number_old - 1].length);
          lhsTrs.line_number_old += 1;
          lhsTrs.lhsStartPos = 0;
          break;
        }
        else {
          lhsTrs.lhsStartPos += 1;
        }
      }
    }
  }

  for (var i = 0; i < rhsSortedTrs.length; i++) {
    var rhsTrs = rhsSortedTrs[i]
    var codeLines = rhsTrs.new_code.split('\n')
    for (var j = 0; j < codeLines.length; j++) {
      while (rhsTrs.rhsStartPos < rhs[rhsTrs.line_number_new - 1].length) {
        if (rhs[rhsTrs.line_number_new - 1].substring(rhsTrs.rhsStartPos, rhsTrs.rhsStartPos + codeLines[j].length) == codeLines[j]) {
          rhs[rhsTrs.line_number_new - 1] = rhs[rhsTrs.line_number_new - 1].substring(0, rhsTrs.rhsStartPos) + rhs[rhsTrs.line_number_new - 1].substring(rhsTrs.rhsStartPos + codeLines[j].length, rhs[rhsTrs.line_number_new - 1].length);
          rhsTrs.line_number_new += 1;
          rhsTrs.rhsStartPos = 0;
          break;
        }
        else {
          rhsTrs.rhsStartPos += 1;
        }
      }
    }
  }
  var lhsOneLine = "";
  for (var i = 0; i < lhs.length - 1; i++) {
    if (lhs[i].length != 0) {
      lhsOneLine += lhs[i];
      lhsOneLine += "\n";  
    }
  }
  lhsOneLine += lhs[lhs.length - 1];

  var rhsOneLine = "";
  for (var i = 0; i < rhs.length - 1; i++) {
    if (rhs[i].length != 0) {
      rhsOneLine += rhs[i];
      rhsOneLine += "\n";
    }
  }
  rhsOneLine += rhs[rhs.length - 1];

  await tutorialCheckAjax(lhsOneLine, rhsOneLine);
}










function init() {
    document.getElementById('left').addEventListener('contextmenu', handleCreateContextMenu_left, false);
    document.getElementById('right').addEventListener('contextmenu', handleCreateContextMenu_right, false);
    document.addEventListener('click', handleClearContextMenu, false);
}