function completeShow(completed) {
    completed = completed.split(',');
    for (var fileNum in completed) {
        var buttonId = "file" + (Number(fileNum) + 1);
        if (completed[fileNum] == -1) {
            document.getElementById(buttonId).style.backgroundColor = '#fd6a78';
        }
        else if (completed[fileNum] == 0) {
            document.getElementById(buttonId).style.backgroundColor = '#f4f4f4';
        }
        else {
            document.getElementById(buttonId).style.backgroundColor = '#0dff47';
        }
    }
}