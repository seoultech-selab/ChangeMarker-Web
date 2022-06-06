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
async function GenController(type, typeCheck, check=0) {
    if (type == typeCheck) {
        if (type == 0) {
            GenDelete();
        }
        else if (type == 1) {
            GenInsert();
        }
        else if (type == 2) {
            if (check == 1)
                GenMoveLeft();
            else
                GenMoveRight();
        }
        else {
            if (check == 1)
                GenUpdateLeft();
            else
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