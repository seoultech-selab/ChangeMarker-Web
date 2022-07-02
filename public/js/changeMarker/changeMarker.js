function setSelectionsOld() {
    setSelectionOld();
    setSelectionRangyOld();
}

function setSelectionsNew() {
    setSelectionNew();
    setSelectionRangyNew();
}


function isRightClicked(e) {
    let te = e || window.event;

    if ("which" in te) // Gecko (Firefox), WebKit (Safari/Chrome) & Opera
        return (te.which == 3);
    else if ("button" in te) // IE, Opera 
        return (te.button == 2); 
    return null;
}


function initChangeMarker() {
    initSelectionHighlighter();

    document.querySelector('#left').addEventListener('mousedown', (e) => {
        if (!isRightClicked(e)) {
            console.log("remove All left");
            removeAllHighlightsOld();
        } else {

        }
    });
    document.querySelector('#left').addEventListener('mouseup', (e) => {
        if (!isRightClicked(e)) {
            setSelectionsOld()
            highlightSelectionOld();
        } else {

        }
    });

    document.querySelector('#right').addEventListener('mousedown', (e) => {
        if (!isRightClicked(e)) {
            removeAllHighlightsNew();
        } else {
            
        }
    });
    document.querySelector('#right').addEventListener('mouseup', (e) => {
        if (!isRightClicked(e)) {
            setSelectionsNew();
            highlightSelectionNew();
        } else {

        }
    });
}