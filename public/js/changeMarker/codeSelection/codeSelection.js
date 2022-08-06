let selection = document.getSelection();

let oldDraggedCodeInfo = {
    codeText : "",
    length : 0,
    startLine : -1,
    endLine : -1,
    offsetFromStartLine : -1,
    offset : -1
};
let newDraggedCodeInfo = {
    codeText : "",
    length : 0,
    startLine : -1,
    endLine : -1,
    offsetFromStartLine : -1,
    offset : -1
};

let oldCodeGridOffsetSum;
let newCodeGridOffsetSum;


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
    let startLine = getStartLine();
    if (startLine == -1) return -1;
    switch (type) {
        case "#left": 
            return oldCodeGridOffsetSum[startLine - 1] + getoffsetFromStartLine(type);
        case "#right":
            return newCodeGridOffsetSum[startLine - 1] + getoffsetFromStartLine(type);
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

function initCodeSelection() {
    const oldCode = document.querySelector("#left");
    const newCode = document.querySelector("#right");

    const oldTbody = oldCode.querySelector("pre code table tbody");
    const newTbody = newCode.querySelector("pre code table tbody");

    oldCodeGridOffsetSum = [0, ];
    newCodeGridOffsetSum = [0, ];

    for (var i = 0; i < oldTbody.childNodes.length; i++) {
        const tr = oldTbody.childNodes.item(i);
        const td = tr.querySelector('.hljs-ln-code');

        oldCodeGridOffsetSum.push(oldCodeGridOffsetSum[i] + td.textContent.length);
    }

    for (var i = 0; i < newTbody.childNodes.length; i++) {
        const tr = newTbody.childNodes.item(i);
        const td = tr.querySelector('.hljs-ln-code');

        newCodeGridOffsetSum.push(newCodeGridOffsetSum[i] + td.textContent.length);
    }

    console.log(oldCodeGridOffsetSum);
    console.log(newCodeGridOffsetSum);
}