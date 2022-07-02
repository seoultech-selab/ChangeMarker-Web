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


function isDraggedCodeInfoInvalid(draggedCodeInfo) {
    if (draggedCodeInfo == null) return true;
    return (draggedCodeInfo.startLine == -1) || !(/\S/.test(draggedCodeInfo.codeText));
}

function isInsertValid() {
    if (isDraggedCodeInfoInvalid(newDraggedCodeInfo)) {
        newDraggedCodeInfoInvalidSwal(); return false;
    }
    return true;
}

function isDeleteValid() {
    if (isDraggedCodeInfoInvalid(oldDraggedCodeInfo)) {
        oldDraggedCodeInfoInvalidSwal(); return false;
    }
    return true;
}

function isMoveValid() {
    if (isDraggedCodeInfoInvalid(newDraggedCodeInfo)) {
        newDraggedCodeInfoInvalidSwal(); return false;
    }
    if (isDraggedCodeInfoInvalid(oldDraggedCodeInfo)) {
        oldDraggedCodeInfoInvalidSwal(); return false;
    }

    return true;
}

function isUpdateValid() {
    if (isDraggedCodeInfoInvalid(newDraggedCodeInfo)) {
        newDraggedCodeInfoInvalidSwal(); return false;
    }
    if (isDraggedCodeInfoInvalid(oldDraggedCodeInfo)) {
        oldDraggedCodeInfoInvalidSwal(); return false;
    }

    return true;
}