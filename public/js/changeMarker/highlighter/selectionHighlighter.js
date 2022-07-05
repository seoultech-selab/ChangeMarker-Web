const selectionHighlightClassName = "highlight_select";

let selectionCssApplier;

let highlighterOld;
let highlighterNew;

let selectionRangyOld;
let selectionRangyNew;

function initSelectionHighlighter() {
    rangy.init();

    selectionCssApplier = rangy.createClassApplier(selectionHighlightClassName, {
        normalize: true
    });

    highlighterOld = rangy.createHighlighter(document.querySelector('.left'), "TextRange");
    highlighterOld.addClassApplier(selectionCssApplier);

    highlighterNew = rangy.createHighlighter(document.querySelector('.right'), "TextRange");
    highlighterNew.addClassApplier(selectionCssApplier);
}


function setSelectionRangyOld() {
    selectionRangyOld = rangy.getSelection();
}

function setSelectionRangyNew() {
    selectionRangyNew = rangy.getSelection();
}


function highlightSelectionOld() {
    highlighterOld.highlightSelection(selectionHighlightClassName, selectionRangyOld);
}

function highlightSelectionNew() {
    highlighterNew.highlightSelection(selectionHighlightClassName, selectionRangyNew);
}

function removeAllHighlightsOld() {
    highlighterOld.removeAllHighlights();
}

function removeAllHighlightsNew() {
    highlighterNew.removeAllHighlights();
}