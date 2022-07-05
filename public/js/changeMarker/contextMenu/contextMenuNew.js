function renderContextMenuListNew(list){
    const ctxMenuList = document.createElement('ul');
    
    list.forEach(function(item){
      const ctxMenuItem = document.createElement('li');
      const ctxMenuItem_a = document.createElement('a');
      const ctxMenuItem_a_text = document.createTextNode(item.label);
      
      if (item.onClick) {
        ctxMenuItem.addEventListener( 'click', item.onClick, false );
      }

      ctxMenuItem_a.appendChild(ctxMenuItem_a_text);
      ctxMenuItem.appendChild(ctxMenuItem_a);
      ctxMenuList.appendChild(ctxMenuItem);
    });
    
    return ctxMenuList;
}

function handleCreateContextMenuNew(event){
    event.preventDefault();
    
    const ctxMenuId = 'dochi_context_menu';
    const ctxMenu = document.createElement('div');
    
    ctxMenu.id = ctxMenuId;
    ctxMenu.className = 'custom-context-menu';
    
    ctxMenu.style.top = event.pageY+'px';
    ctxMenu.style.left = event.pageX+'px';
    
    ctxMenu.appendChild(renderContextMenuListNew([
      {
        label: "Generate Insert",
        onClick: generateInsert
      },
      {
        label: "Generate Move",
        onClick: generateMove
      },
      {
        label: "Generate Update",
        onClick: generateUpdate
      },
    ]));
    
    const prevCtxMenu = document.getElementById(ctxMenuId);
    if (prevCtxMenu) {
      prevCtxMenu.remove();
    }
    
    document.body.appendChild(ctxMenu);
}
  
function handleClearContextMenuNew(event){
    const ctxMenu = document.getElementById('dochi_context_menu');
    if (ctxMenu) {
      ctxMenu.remove();
    }
}

function initContextMenuRight() {
    document.querySelector('#right').addEventListener('contextmenu', handleCreateContextMenuNew, false);
    document.querySelector('#right').addEventListener('click', handleClearContextMenuNew, false);
}