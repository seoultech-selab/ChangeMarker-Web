function setSelectionsOld() {
    setSelectionOld();
    setSelectionRangyOld();
}

function setSelectionsNew() {
    setSelectionNew();
    setSelectionRangyNew();
}

function isTutorial() {
    return document.getElementById("current").value.includes('tutorial');
}

function generateInsert(e) {
    if (isTutorial()) {
        GenInsert({
            len : newDraggedCodeInfo.length,
            startPos : newDraggedCodeInfo.offset,
            text : newDraggedCodeInfo.codeText,
            lineNum : newDraggedCodeInfo.startLine,
        }); return;
    }

    if (isInsertValid()) {
        scriptDBInsert();
        // removeAllHighlightsNew();
    }
    
    handleClearContextMenuNew(e);
}

function generateDelete(e) {
    if (isTutorial()) {
        exGenDelete({
            len : oldDraggedCodeInfo.length,
            startPos : oldDraggedCodeInfo.offset,
            text : oldDraggedCodeInfo.codeText,
            lineNum : oldDraggedCodeInfo.startLine,
        }); return;
    }

    if (isDeleteValid()) {
        scriptDBDelete();
        // removeAllHighlightsOld();
    }

    handleClearContextMenuOld(e);
}

function generateMove(e) {
    if (isTutorial()) {
        GenMoveLeft({
            len : oldDraggedCodeInfo.length,
            startPos : oldDraggedCodeInfo.offset,
            text : oldDraggedCodeInfo.codeText,
            lineNum : oldDraggedCodeInfo.startLine,
        }, {
            len : newDraggedCodeInfo.length,
            startPos : newDraggedCodeInfo.offset,
            text : newDraggedCodeInfo.codeText,
            lineNum : newDraggedCodeInfo.startLine,
        }); return;
    }

    if (isMoveValid()) {
        scriptDBMove();
        // removeAllHighlightsNew();
        // removeAllHighlightsOld();
    }

    handleClearContextMenuNew(e);
    handleClearContextMenuOld(e);
}

function generateUpdate(e) {
    if (isTutorial()) {
        GenUpdateLeft({
            len : oldDraggedCodeInfo.length,
            startPos : oldDraggedCodeInfo.offset,
            text : oldDraggedCodeInfo.codeText,
            lineNum : oldDraggedCodeInfo.startLine,
        }, {
            len : newDraggedCodeInfo.length,
            startPos : newDraggedCodeInfo.offset,
            text : newDraggedCodeInfo.codeText,
            lineNum : newDraggedCodeInfo.startLine,
        }); return;
    }

    if (isUpdateValid()) {

        scriptDBUpdate();
        // removeAllHighlightsNew();
        // removeAllHighlightsOld();
    }

    handleClearContextMenuNew(e);
    handleClearContextMenuOld(e);
}


function isRightClicked(e) {
    let te = e || window.event;

    if ("which" in te) // Gecko (Firefox), WebKit (Safari/Chrome) & Opera
        return (te.which == 3);
    else if ("button" in te) // IE, Opera 
        return (te.button == 2); 
    return null;
}

function isValidCodeSelectionArea(event) {
    let node = event.target;
        while (node.tagName != "TABLE" && node.tagName != "DIV")
            node = node.parentNode;
        return node.tagName == "TABLE" ? true : false;
}

function initLeftDivEvent() {
    document.querySelector('#left').addEventListener('mousedown', (e) => {
        if (!isValidCodeSelectionArea(e)) return;
        if (!isRightClicked(e)) {
            removeAllHighlightsOld();
        } else {

        }
    });
    document.querySelector('#left').addEventListener('mouseup', (e) => {
        if (!isValidCodeSelectionArea(e)) return;
        if (!isRightClicked(e)) {
            setSelectionsOld()
            highlightSelectionOld();
        } else {

        }
    });
}

function initRightDivEvent() {
    document.querySelector('#right').addEventListener('mousedown', (e) => {
        if (!isValidCodeSelectionArea(e)) return;
        if (!isRightClicked(e)) {
            removeAllHighlightsNew();
        } else {
            
        }
    });
    document.querySelector('#right').addEventListener('mouseup', (e) => {
        if (!isValidCodeSelectionArea(e)) return;
        if (!isRightClicked(e)) {
            setSelectionsNew();
            highlightSelectionNew();
        } else {

        }
    });
}

function initChangeMarker() {
    initSelectionHighlighter();
    // initCodeSelection();

    initContextMenuLeft();
    initContextMenuRight();
    
    initLeftDivEvent();
    initRightDivEvent();
}