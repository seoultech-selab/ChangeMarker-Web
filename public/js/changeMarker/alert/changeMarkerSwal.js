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

function tutorialSwal() {
    swal({
        title: "Tutorial",
        text: "Which script needs explanation?",
        buttons: {
            delete: "Delete",
            insert: "Insert",
            move: "Move",
            update: "Update",
            OK: true
        },
    })
    .then((value) => {
        switch (value) {
            case "delete":
                swal('Delete \
                operations can be used to indicate deleted parts of the code. \
                If you think a certain code fragment is deleted in the old version,  \
                so it no longer exists in the new version, you can use "Delete" operation to describe such changes.');
                break;
            case "insert":
                swal('Insert operations can be used to indicate insert parts of the code.  \
                If you think a certain code fragment was not in the old version, \
                but it is newly added in the new version, \
                you can use "Insert" operation to describe such changes.');
                break;
            case "move":
                swal("Move operations are possible that a code fragment itself is not changed, \
                but simply its location is changed.");
                break;
            case "update":
                swal("Update operations can be used for simple changes without affecting code structure.\
                This includes cases where only the value has changed, \
                such as function name changes or only the value assigned to a variable change.")
                break;
        }
    });
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