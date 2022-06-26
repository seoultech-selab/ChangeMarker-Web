const TYPE_NAMES = ["Delete", "Insert", "Move", "Update"];
async function exGenController(type, typeCheck) {
    if (type.includes(typeCheck)) {
        if (typeCheck == 0) {
          exGenDelete();
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
      if (type.includes(2) || type.includes(3))
        type = 2;
      else if (type.includes(4) || type.includes(5))
        type = 3;

      alert('This example has a only "' + TYPE_NAMES[type] + '" script!');
    }

}

async function exDeleteRow(element, e) {
    let table = document.getElementById("edit_scripts");
    let target = element.parentNode.parentNode;
    let rowNum = target.rowIndex;

    table.deleteRow(rowNum);
}

function move_inner(leftX, leftY, rightX, rightY) {
  let left = document.getElementById("left");
  let right = document.getElementById("right")

  left.scrollTo(leftX, leftY);
  right.scrollTo(rightX, rightY);
}

function exHandleCreateContextMenu_left(event){
  event.preventDefault();
  
  const ctxMenuId = 'dochi_context_menu';
  const ctxMenu = document.createElement('div');
  
  ctxMenu.id = ctxMenuId;
  ctxMenu.className = 'custom-context-menu';
  
  ctxMenu.style.top = event.pageY+'px';
  ctxMenu.style.left = event.pageX+'px';
  
  ctxMenu.appendChild(renderContextMenuList([
    {
      label: "Generate Delete",
      onClick: function(){
        exGenController(genControllerType, 0);
      }
    },
    {
      label: "Generate Move",
      onClick: function(event){
        exGenController(genControllerType, 2);
      }
    },
    {
      label: "Generate Update",
      onClick: function(event){
        exGenController(genControllerType, 4);
      }
    }
  ]));
  
  const prevCtxMenu = document.getElementById( ctxMenuId );
  if( prevCtxMenu ){
    prevCtxMenu.remove();
  }

  document.body.appendChild( ctxMenu );
}

function exHandleCreateContextMenu_right(event){
  event.preventDefault();
  
  const ctxMenuId = 'dochi_context_menu';
  const ctxMenu = document.createElement('div');
  
  ctxMenu.id = ctxMenuId;
  ctxMenu.className = 'custom-context-menu';
  
  ctxMenu.style.top = event.pageY+'px';
  ctxMenu.style.left = event.pageX+'px';
  
  ctxMenu.appendChild(renderContextMenuList([
      {
      label: "Generate Insert",
        onClick: function(event){
          exGenController(genControllerType, 1);
        }
      },
      {
      label: "Generate Move",
        onClick: function(event){
          exGenController(genControllerType, 3);
        }
      },
      {
      label: "Generate Update",
        onClick: function(event){
          exGenController(genControllerType, 5);
        }
      }
  ]));
  
  const prevCtxMenu = document.getElementById( ctxMenuId );
  if( prevCtxMenu ){
    prevCtxMenu.remove();
  }
  
  document.body.appendChild( ctxMenu );
}

function exInit() {
  document.getElementById('left').onmousedown = restoreContentLeft;
  document.getElementById('right').onmousedown = restoreContentRight;
  document.getElementById('left').onmouseup = storeSelectionLeft;
  document.getElementById('right').onmouseup = storeSelectionRight;
  document.getElementById('left').addEventListener('contextmenu', exHandleCreateContextMenu_left, false);
  document.getElementById('right').addEventListener('contextmenu', exHandleCreateContextMenu_right, false);
  document.addEventListener('click', handleClearContextMenu, false);
}