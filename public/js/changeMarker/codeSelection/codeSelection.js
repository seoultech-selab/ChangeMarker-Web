let selection = document.getSelection();

let oldDraggedCodeInfo;
let newDraggedCodeInfo;


function setSelectionOld() {
    oldDraggedCodeInfo = getOldDraggedCodeInfo();
}

function setSelectionNew() {
    newDraggedCodeInfo = getNewDraggedCodeInfo();
}


function getDraggedCodeText() {
    return selection.toString();
}

function getDraggedCodeTextLength() {
    return getDraggedCodeText(selection).length;
}


function getStartLine() {
    let anchor = selection.anchorNode;
    let focus = selection.focusNode;

    if (anchor == null || focus == null) {
        return -1;
    }

    return Math.min(getNodeLine(anchor), getNodeLine(focus));
}

function getEndLine() {
    let anchor = selection.anchorNode;
    let focus = selection.focusNode;

    if (anchor == null || focus == null) {
        return -1;
    }

    return Math.max(getNodeLine(anchor), getNodeLine(focus));
}

function getNodeLine(node) {
    if (node == null)
        return -1;

    let tr = node;
    while (tr.tagName != "TR") {
        if (tr.parentNode == null)
            return -1;
        tr = tr.parentNode;
    }

    return tr.querySelector('.hljs-ln-n').getAttribute('data-line-number');
}


function getoffsetFromStartLine(type) {
    const startLine = getStartLine();
    if (startLine == -1)
        return -1;

    const tbody = document.querySelector(type + ' tbody');
    const td = tbody.childNodes.item(startLine - 1).querySelector('.hljs-ln-code');

    let result = 0;
    for (child of td.childNodes) {
        if (child.contains(selection.anchorNode))
            return result + selection.anchorOffset;
        else if (child.contains(selection.focusNode))
            return result + selection.focusOffset;
        else
            result += child.textContent.length;
    }
    
    return -1;
}

function getOffset(type) {
    const tbody = document.querySelector(type + " tbody");

    let result = 0;
    for (tr of tbody.childNodes) {
        const td = tr.querySelector('.hljs-ln-code');

        if (td.contains(selection.anchorNode) || td.contains(selection.focusNode))
            return result + getoffsetFromStartLine(type);
        else
            result += td.textContent.length;
    }

    return -1;
}


function getDraggedCodeInfo(type) {
    return {
        codeText : getDraggedCodeText(),
        length : getDraggedCodeTextLength(),
        startLine : getStartLine(),
        endLine : getEndLine(),
        offsetFromStartLine : getoffsetFromStartLine(type),
        offset : getOffset(type)
    };
}

function getOldDraggedCodeInfo() {
    return getDraggedCodeInfo('#left')
}

function getNewDraggedCodeInfo() {
    return getDraggedCodeInfo('#right')
}