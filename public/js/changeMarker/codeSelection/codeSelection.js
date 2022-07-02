let selectionOld;
let selectionNew;


function setSelectionOld() {
    selectionOld = document.getSelection();
}

function setSelectionNew() {
    selectionNew = document.getSelection();
}


function getDraggedCodeText(selection) {
    return selection.toString();
}

function getDraggedCodeTextLength(selection) {
    return getDraggedCodeText(selection).length;
}


function getStartLine(selection) {
    let anchor = selection.anchorNode;
    let focus = selection.focusNode;

    if (anchor == null || focus == null) {
        return -1;
    }

    return Math.min(getNodeLine(anchor), getNodeLine(focus));
}

function getEndLine(selection) {
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


function getoffsetFromStartLine(selection) {
    const startLine = getStartLine();
    if (startLine == -1)
        return -1;

    const tbody = document.querySelector('tbody');
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
    const selection = selection;

    let result = 0;
    for (tr of tbody.childNodes) {
        const td = tr.querySelector('.hljs-ln-code');

        if (td.contains(selection.anchorNode) || td.contains(selection.focusNode))
            return result + getoffsetFromStartLine();
        else
            result += td.textContent.length;
    }

    return -1;
}


function getDraggedCodeInfo(selection, type) {
    return {
        codeText : getDraggedCodeText(selection),
        length : getDraggedCodeTextLength(selection),
        startLine : getStartLine(selection),
        endLine : getEndLine(selection),
        offsetFromStartLine : getoffsetFromStartLine(selection),
        offset : getOffset(type)
    };
}

function getOldDraggedCodeInfo() {
    return getDraggedCodeInfo(selectionOld, '.left')
}

function getNewDraggedCodeInfo() {
    return getDraggedCodeInfo(selectionNew, '.right')
}