function srcInvalidSwal() {
    swal({
        text : 'This action is not allowed.',
        icon : 'error',
    });
}

function draggedCodeInfoInvalidSwal(text) {
    swal({
        text : text,
        icon : 'error',
    });
}

function oldDraggedCodeInfoInvalidSwal() {
    draggedCodeInfoInvalidSwal('Please select texts on the left side.');
}

function newDraggedCodeInfoInvalidSwal() {
    draggedCodeInfoInvalidSwal('Please select texts on the right side.');
}

function oldDraggedCodeInfoDuplicatedSwal() {
    draggedCodeInfoInvalidSwal('You have selected an area that has already been saved. Please select the left area again.');
}

function newDraggedCodeInfoDuplicatedSwal() {
    draggedCodeInfoInvalidSwal('You have selected an area that has already been saved. Please select the right area again.');
}


function isOldDraggedCodeInfoDuplicated() {
    return false;
}

function isNewDraggedCodeInfoDuplicated() {
    return false;
}


function isDraggedCodeInfoInvalid(draggedCodeInfo) {
    if (draggedCodeInfo == null) return true;
    return (draggedCodeInfo.startLine == -1) || !(/\S/.test(draggedCodeInfo.codeText));
}

function isActionValid(isOldDraggedInfoUsed, isNewDraggedInfoUsed) {
    if (isOldDraggedInfoUsed) {
        if (isOldDraggedCodeInfoDuplicated()) {
            oldDraggedCodeInfoDuplicatedSwal(); return false;
        }

        if (isDraggedCodeInfoInvalid(oldDraggedCodeInfo)) {
            oldDraggedCodeInfoInvalidSwal(); return false;
        }
    }

    if (isNewDraggedInfoUsed) {
        if (isNewDraggedCodeInfoDuplicated()) {
            newDraggedCodeInfoDuplicatedSwal(); return false;
        }
        
        if (isDraggedCodeInfoInvalid(newDraggedCodeInfo)) {
            newDraggedCodeInfoInvalidSwal(); return false;
        }
    }

    return true;
}

function isInsertValid() {
    let isOldDraggedInfoUsed = false;
    let isNewDraggedInfoUsed = true;
    return isActionValid(isOldDraggedInfoUsed, isNewDraggedInfoUsed);
}

function isDeleteValid() {
    let isOldDraggedInfoUsed = true;
    let isNewDraggedInfoUsed = false;
    return isActionValid(isOldDraggedInfoUsed, isNewDraggedInfoUsed);
}

function isMoveValid() {
    let isOldDraggedInfoUsed = true;
    let isNewDraggedInfoUsed = true;
    return isActionValid(isOldDraggedInfoUsed, isNewDraggedInfoUsed);
}

function isUpdateValid() {
    let isOldDraggedInfoUsed = true;
    let isNewDraggedInfoUsed = true;
    return isActionValid(isOldDraggedInfoUsed, isNewDraggedInfoUsed);
}