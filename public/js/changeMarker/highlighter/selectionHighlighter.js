const selectionHighlightClassName = "highlight_select";

let selectionRangyOld = new Object();
let selectionRangyNew = new Object();

let oldCodeTbody;
let newCodeTbody;

let oldCodeInfo = new Object();
let newCodeInfo = new Object();

function initSelectionHighlighter() {
    initTbody();
}

function setSelectionRangyOld() {
    let type = "#left";
    selectionRangyOld = getSelectionRangy(type);

    oldCodeInfo = new Object();
    oldCodeInfo.startLine = getStartLine(type);
    oldCodeInfo.endLine = getEndLine(type);
}

function setSelectionRangyNew() {
    let type = "#right";
    selectionRangyNew = getSelectionRangy(type);

    newCodeInfo = new Object();
    newCodeInfo.startLine = getStartLine(type);
    newCodeInfo.endLine = getEndLine(type);
}

function getSelectionRangy(type) {
    let result = new Object();

    result.sideNodes = getSideNodes(type);
    result.leafNodes = getLeafNodes(type, result.sideNodes);

    if (result.sideNodes == null || result.leafNodes == null) return null;

    return result; 
}

function getSideNodes(type) {
    let nodes = new Object();

    const startLine = getStartLine();
    if (startLine == -1)
        return null;

    const tbody = document.querySelector(type + ' tbody');
    const td = tbody.childNodes.item(startLine - 1).querySelector('.hljs-ln-code');

    const anchorNode = selection.anchorNode;
    const anchorOffset = selection.anchorOffset;
    const focusNode  = selection.focusNode;
    const focusOffset = selection.focusOffset;

    if (anchorNode == focusNode) {
        nodes.startNode = anchorNode;
        nodes.startOffset = Math.min(anchorOffset, focusOffset);
        nodes.endNode = anchorNode;
        nodes.endOffset = Math.max(anchorOffset, focusOffset);

        return nodes;
    }

    return getSideNodesDFS(td, anchorNode, anchorOffset, focusNode, focusOffset);
}

function getSideNodesDFS(node, anchorNode, anchorOffset, focusNode, focusOffset) {
    let nodes = new Object();

    if (node.childNodes.length == 0) {
        if (node.contains(anchorNode)) {
            nodes.startNode = anchorNode;
            nodes.startOffset = anchorOffset;
            nodes.endNode = focusNode;
            nodes.endOffset = focusOffset;

            return nodes;
        }
        else if (node.contains(focusNode)) {
            nodes.endNode = anchorNode;
            nodes.endOffset = anchorOffset;
            nodes.startNode = focusNode;
            nodes.startOffset = focusOffset;

            return nodes;
        }
        else 
            return null;
    }

    for (var child of node.childNodes) {
        let nodes = getSideNodesDFS(child, anchorNode, anchorOffset, focusNode, focusOffset);
        if (nodes != null) return nodes;
    }

    return null;
}

function getLeafNodes(type, side) {
    if (side == null) return null;
    if (side.startNode == side.endNode)
        return side.startOffset == side.endOffset ? [] : [side.startNode];

    const tbody = document.querySelector(type + ' tbody');
    const startLine = getStartLine(type);
    const endLine = getEndLine(type);
    let nodes = [];
    let isStartNodeVisited = [false];

    for (var line = startLine; line <= endLine; line++) {
        const td = tbody.childNodes.item(line - 1).querySelector('.hljs-ln-code');

        getLeafNodesDFS(td, nodes, isStartNodeVisited, side);
    }

    return nodes;
}

function getLeafNodesDFS(node, logs, isStartNodeVisited, side) {
    if (node == side.startNode) isStartNodeVisited[0] = true;
    if (node == side.endNode) {
        logs.push(node); return true;
    }

    if (node.childNodes.length == 0 && isStartNodeVisited[0]) {
        logs.push(node);
    }

    for (var child of node.childNodes) {
        if (getLeafNodesDFS(child, logs, isStartNodeVisited, side)) return true;
    }

    return false;
}

function spliceText(text, from, to) {
    if (from == to) return [text];

    let spliced = []
    if (from > 0) {
        spliced.push(text.slice(0, from));
    }
    spliced.push(text.slice(from, to));
    if (to < text.length) {
        spliced.push(text.slice(to, text.length));
    }

    return spliced;
}

function spliceNode(textNode, from, to) {
    let splicedText = spliceText(textNode.wholeText, from, to);
    let spliced = [];
    splicedText.forEach((text) => spliced.push(document.createTextNode(text)));
    return spliced;
}

function createSelectionSpan(textNode) {
    let span = document.createElement("span");
    span.className = "highlight_select";
    span.innerText = textNode.wholeText == undefined ? textNode.innerText : textNode.wholeText;
    return span;
}

function replaceNode(newNodes, oldNode) {
    if (newNodes.length == 1) {
        oldNode.replaceWith(newNodes[0]);
    }
    if (newNodes.length == 2) {
        oldNode.replaceWith(newNodes[0], newNodes[1]);
    }
    if (newNodes.length == 3) {
        oldNode.replaceWith(newNodes[0], newNodes[1], newNodes[2]);
    }
}

function isNullOUndefined(obj) {
    return (obj == null) || (obj == undefined);
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
    return event.target.parentNode.querySelector("table") != null;
}

function initTbody() {
    let codes = document.querySelectorAll("pre code");
    for (var code of codes)
        if (code.querySelector("tbody") == null) {
            const callback = (mutationList, observer) => {
                let codes = document.querySelectorAll("pre code");
                for (var code of codes)
                    if (code.querySelector("tbody") == null) return;
        
                const oldCode = document.querySelector("#left");
                const newCode = document.querySelector("#right");
        
                const oldTbody = oldCode.querySelector("pre code table tbody");
                const newTbody = newCode.querySelector("pre code table tbody");
        
                if (oldTbody == null || newTbody == null) return;
        
                oldCodeTbody = document.createDocumentFragment();
                oldCodeTbody = oldTbody.cloneNode(true);
        
                newCodeTbody = document.createDocumentFragment();
                newCodeTbody = newTbody.cloneNode(true);

                initCodeSelection();
        
                observer.disconnect();
            }
        
            const targets = document.querySelectorAll("section#section");
            const config = { attributes: true, childList: true, subtree: true };
        
            const observer = new MutationObserver(callback);
            targets.forEach((target) => {observer.observe(target, config)});
            return;
        }

    const oldCode = document.querySelector("#left");
    const newCode = document.querySelector("#right");

    const oldTbody = oldCode.querySelector("pre code table tbody");
    const newTbody = newCode.querySelector("pre code table tbody");

    if (oldTbody == null || newTbody == null) return;

    oldCodeTbody = document.createDocumentFragment();
    oldCodeTbody = oldTbody.cloneNode(true);

    newCodeTbody = document.createDocumentFragment();
    newCodeTbody = newTbody.cloneNode(true);
}

function initSourceCodeObserver() {
}

function highlightSelectionOld() {
    highlightCodeSelection(selectionRangyOld);
}

function highlightSelectionNew() {
    highlightCodeSelection(selectionRangyNew);
}

function highlightCodeSelection(codeNodeInfo) {
    if (isNullOUndefined(codeNodeInfo)) return;

    let leafNodes = codeNodeInfo.leafNodes;
    let sideNodes = codeNodeInfo.sideNodes;
    if (isNullOUndefined(leafNodes) || leafNodes.length == 0) return;

    let length = leafNodes.length;
    let afterLeafNodes = [];

    let leaf = leafNodes[0];
    let from = sideNodes.startOffset;
    let to = (sideNodes.startNode == sideNodes.endNode) ? sideNodes.endOffset : leaf.wholeText.length;
    
    let spliced = spliceNode(leaf, from, to);

    let highlighted = spliced.length == 1 ? 0 : 1;
    let span = createSelectionSpan(spliced[highlighted]);
    spliced[highlighted] = span;
    replaceNode(spliced, leaf);

    for (var i = 1; i < length - 1; i++) {
        leaf = leafNodes[i];

        let span = createSelectionSpan(leaf);

        leaf.parentNode.replaceChild(span, leaf);
        afterLeafNodes.push(span);
    }

    if (length > 1) {
        leaf = leafNodes[length - 1];
        from = 0;
        to = sideNodes.endOffset;

        spliced = spliceNode(leaf, from, to);

        let span = createSelectionSpan(spliced[0]); 
        spliced[0] = span;
        replaceNode(spliced, leaf);
    }

    codeNodeInfo.leafNodes = afterLeafNodes;
    selection.removeAllRanges();
}

function removeAllHighlightsOld() {
    removeAllHighlights(oldCodeInfo, selectionRangyOld, "#left", oldCodeTbody);
}

function removeAllHighlightsNew() {
    removeAllHighlights(newCodeInfo, selectionRangyNew, "#right", newCodeTbody);
}

function removeAllHighlights(codeInfo, codeNodeInfo, type, originCodeTbody) {
    if (codeInfo == undefined || codeInfo == null) return;
    if (codeInfo.startLine == -1) return;

    let tbody = document.querySelector(type + " tbody");
    for (var i = codeInfo.startLine; i <= codeInfo.endLine; i++) {
        tbody.replaceChild(originCodeTbody.childNodes.item(i - 1).cloneNode(true), tbody.childNodes.item(i - 1));
    }

    codeInfo = undefined;
    codeNodeInfo = undefined;
}